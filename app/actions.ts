"use server";

import { generateText, gateway } from "ai";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb, isDbConfigured } from "@/lib/db";
import { quotes, type QuoteRecord } from "@/lib/db/schema";

const MODEL = process.env.AI_GATEWAY_MODEL ?? "openai/gpt-4o-mini";

export type QuoteState =
  | { status: "idle" }
  | { status: "success"; person: string; quote: string }
  | { status: "error"; message: string };

/**
 * Takes a famous person's name, asks the AI Gateway for one of their quotes,
 * stores it in the database, and returns it. Wired to a form via useActionState.
 */
export async function generateQuote(
  _prev: QuoteState,
  formData: FormData
): Promise<QuoteState> {
  const person = String(formData.get("person") ?? "").trim();

  if (!person) {
    return { status: "error", message: "Adj meg egy nevet." };
  }
  if (person.length > 100) {
    return { status: "error", message: "A név túl hosszú." };
  }
  if (!process.env.AI_GATEWAY_API_KEY) {
    return {
      status: "error",
      message:
        "Az AI Gateway nincs konfigurálva (AI_GATEWAY_API_KEY hiányzik). Lásd .env.example.",
    };
  }
  if (!isDbConfigured()) {
    return {
      status: "error",
      message: "Az adatbázis nincs konfigurálva (DATABASE_URL hiányzik). Lásd .env.example.",
    };
  }

  let quote: string;
  try {
    const { text } = await generateText({
      model: gateway(MODEL),
      // Higher temperature so repeated lookups can surface different quotes.
      temperature: 0.9,
      system:
        "Egy idézet-adatbázis vagy. Adott egy híres személy neve; adj vissza " +
        "PONTOSAN EGY valódi, neki tulajdonított idézetet a közismert " +
        "megfogalmazásban. Csak magát az idézet szövegét add vissza — " +
        "idézőjelek, név és bármilyen magyarázat nélkül. Ha nem ismersz tőle " +
        "hiteles idézetet, válaszolj egyetlen szóval: UNKNOWN.",
      prompt: person,
    });
    quote = text.trim().replace(/^["„”]+|["„”]+$/g, "").trim();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Ismeretlen hiba a generáláskor.";
    return { status: "error", message };
  }

  if (!quote || quote.toUpperCase() === "UNKNOWN") {
    return {
      status: "error",
      message: `Nem találtam hiteles idézetet tőle: ${person}.`,
    };
  }

  try {
    await getDb().insert(quotes).values({ person, quote, model: MODEL });
    revalidatePath("/");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Ismeretlen adatbázis-hiba.";
    return { status: "error", message: `Mentés sikertelen: ${message}` };
  }

  return { status: "success", person, quote };
}

/** Lists stored quotes newest-first. Returns [] if the DB is unreachable. */
export async function listQuotes(): Promise<QuoteRecord[]> {
  if (!isDbConfigured()) return [];
  try {
    return await getDb()
      .select()
      .from(quotes)
      .orderBy(desc(quotes.createdAt))
      .limit(20);
  } catch {
    return [];
  }
}
