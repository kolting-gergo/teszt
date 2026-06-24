"use server";

import { put } from "@vercel/blob";
import { desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { files, type FileRecord } from "@/lib/db/schema";

export type UploadState =
  | { status: "idle" }
  | { status: "success"; url: string; pathname: string }
  | { status: "error"; message: string };

/**
 * Uploads a file to Vercel Blob, then records its metadata in Neon (via Drizzle).
 * Wired to a <form action={...}> through useActionState.
 */
export async function uploadFile(
  _prev: UploadState,
  formData: FormData
): Promise<UploadState> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Válassz ki egy fájlt a feltöltéshez." };
  }

  try {
    // 1. Store the binary in Vercel Blob.
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    // 2. Record the metadata in the database.
    await getDb()
      .insert(files)
      .values({
        pathname: blob.pathname,
        url: blob.url,
        contentType: file.type || blob.contentType,
        size: file.size,
      });

    revalidatePath("/files");
    return { status: "success", url: blob.url, pathname: blob.pathname };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Ismeretlen hiba a feltöltéskor.";
    return { status: "error", message };
  }
}

/** Lists stored files newest-first. Returns [] if the DB is unreachable. */
export async function listFiles(): Promise<FileRecord[]> {
  return getDb().select().from(files).orderBy(desc(files.createdAt)).limit(50);
}
