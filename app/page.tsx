import Link from "next/link";
import { listQuotes } from "./actions";
import { QuoteGenerator } from "./quote-generator";
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

// Render at request time so freshly stored quotes appear.
export const dynamic = "force-dynamic";

export default async function Home() {
  const stored = await listQuotes();

  return (
    <main className={styles.main}>
      <h1 className={styles.heading}>Híres idézetek</h1>
      <p className={styles.intro}>
        Adj meg egy híres embert, és az AI visszaad tőle egy idézetet — amit el
        is tárolunk az adatbázisban.
      </p>

      <QuoteGenerator />

      {stored.length > 0 && (
        <section className={styles.stored}>
          <h2 className={styles.storedTitle}>Korábbi idézetek</h2>
          <ul className={styles.storedList}>
            {stored.map((q) => (
              <li key={q.id} className={styles.storedItem}>
                <span className={styles.storedQuote}>„{q.quote}”</span>
                <span className={styles.storedPerson}>— {q.person}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

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
