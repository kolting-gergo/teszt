import Link from "next/link";
import type { Metadata } from "next";
import { AiPlayground } from "./playground";
import styles from "./ai.module.css";

export const metadata: Metadata = {
  title: "AI Gateway · Playground",
};

export default function AiPage() {
  return (
    <main className={styles.page}>
      <Link href="/" className={styles.back}>
        ← Vissza
      </Link>
      <h1 className={styles.title}>AI Gateway</h1>
      <p className={styles.subtitle}>
        Szöveggenerálás a <strong>Vercel AI Gateway</strong>-en keresztül (AI SDK).
        A modellt a <code>provider/model</code> formában lehet megadni.
      </p>
      <AiPlayground />
    </main>
  );
}
