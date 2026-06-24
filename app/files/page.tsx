import Link from "next/link";
import type { Metadata } from "next";
import { isDbConfigured } from "@/lib/db";
import type { FileRecord } from "@/lib/db/schema";
import { listFiles } from "./actions";
import { UploadForm } from "./upload-form";
import styles from "./files.module.css";

export const metadata: Metadata = {
  title: "Fájlok · Vercel Blob + Neon",
};

// Always render at request time so newly uploaded files show up.
export const dynamic = "force-dynamic";

export default async function FilesPage() {
  const configured = isDbConfigured();

  let items: FileRecord[] = [];
  let loadError: string | null = null;

  if (configured) {
    try {
      items = await listFiles();
    } catch (err) {
      loadError = err instanceof Error ? err.message : "Adatbázis hiba.";
    }
  }

  return (
    <main className={styles.page}>
      <Link href="/" className={styles.back}>
        ← Vissza
      </Link>
      <h1 className={styles.title}>Fájltárolás</h1>
      <p className={styles.subtitle}>
        Feltöltés <strong>Vercel Blob</strong>-ra, a metaadat mentése{" "}
        <strong>Neon</strong> adatbázisba (Drizzle ORM).
      </p>

      {!configured ? (
        <p className={styles.notice}>
          Az adatbázis nincs konfigurálva. Add meg a <code>DATABASE_URL</code> és{" "}
          <code>BLOB_READ_WRITE_TOKEN</code> értékeket a{" "}
          <code>.env.local</code> fájlban, majd futtasd: <code>npm run db:push</code>.
        </p>
      ) : (
        <UploadForm />
      )}

      {loadError && (
        <p className={styles.notice}>Nem sikerült betölteni a fájlokat: {loadError}</p>
      )}

      {configured && !loadError && items.length === 0 && (
        <p className={styles.empty}>Még nincs feltöltött fájl.</p>
      )}

      {items.length > 0 && (
        <ul className={styles.list}>
          {items.map((f) => (
            <li key={f.id} className={styles.item}>
              <a href={f.url} target="_blank" rel="noopener noreferrer">
                {f.pathname}
              </a>
              <span className={styles.itemMeta}>
                {formatSize(f.size)} ·{" "}
                {new Date(f.createdAt).toLocaleString("hu-HU")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
