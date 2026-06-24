import Link from "next/link";
import styles from "./page.module.css";

type Integration = {
  name: string;
  description: string;
  envVar: string;
  href: string;
  cta: string;
};

const integrations: Integration[] = [
  {
    name: "Vercel Blob",
    description: "Fájltárolás — feltöltés és kiszolgálás.",
    envVar: "BLOB_READ_WRITE_TOKEN",
    href: "/files",
    cta: "Fájlok →",
  },
  {
    name: "Vercel Neon",
    description: "Postgres adatbázis Drizzle ORM-mel.",
    envVar: "DATABASE_URL",
    href: "/files",
    cta: "Fájlok →",
  },
  {
    name: "Vercel AI Gateway",
    description: "Modell-hívások egységes átjárón át (AI SDK).",
    envVar: "AI_GATEWAY_API_KEY",
    href: "/ai",
    cta: "Playground →",
  },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Hello World!</h1>
      <blockquote className={styles.quote}>
        „A nagy utazás is egyetlen lépéssel kezdődik.”
        <footer className={styles.quoteFooter}>— Lao-ce</footer>
      </blockquote>

      <section className={styles.stack}>
        <h2 className={styles.stackTitle}>A stack</h2>
        <div className={styles.cards}>
          {integrations.map((i) => {
            const configured = Boolean(process.env[i.envVar]);
            return (
              <Link key={i.name} href={i.href} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardName}>{i.name}</span>
                  <span
                    className={`${styles.badge} ${
                      configured ? styles.badgeOn : styles.badgeOff
                    }`}
                  >
                    {configured ? "konfigurálva" : "beállításra vár"}
                  </span>
                </div>
                <p className={styles.cardDesc}>{i.description}</p>
                <code className={styles.cardEnv}>{i.envVar}</code>
                <span className={styles.cardCta}>{i.cta}</span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
