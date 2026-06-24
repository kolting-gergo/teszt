import { generateText, gateway } from "ai";
import { NextResponse } from "next/server";

// Default model routed through the Vercel AI Gateway.
// Override per-request by sending a "model" field (e.g. "anthropic/claude-3-5-haiku").
const DEFAULT_MODEL = process.env.AI_GATEWAY_MODEL ?? "openai/gpt-4o-mini";

export async function POST(request: Request) {
  if (!process.env.AI_GATEWAY_API_KEY) {
    return NextResponse.json(
      {
        error:
          "AI_GATEWAY_API_KEY nincs beállítva. Add meg a .env.local fájlban (lásd .env.example).",
      },
      { status: 503 }
    );
  }

  let body: { prompt?: unknown; model?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Érvénytelen JSON." }, { status: 400 });
  }

  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  if (!prompt) {
    return NextResponse.json(
      { error: "A 'prompt' mező kötelező." },
      { status: 400 }
    );
  }

  const modelId =
    typeof body.model === "string" && body.model ? body.model : DEFAULT_MODEL;

  try {
    const { text, usage } = await generateText({
      model: gateway(modelId),
      prompt,
    });
    return NextResponse.json({ text, model: modelId, usage });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Ismeretlen hiba a generáláskor.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
