import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Drizzle client backed by the Neon serverless HTTP driver.
 *
 * Lazily initialized so that importing this module (e.g. during `next build`)
 * does not require DATABASE_URL to be set. The connection is only created the
 * first time `db` is actually used.
 */
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (_db) return _db;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add your Vercel Neon connection string to .env.local (see .env.example)."
    );
  }

  const sql = neon(url);
  _db = drizzle(sql, { schema });
  return _db;
}

/** True when a database connection string is configured. */
export function isDbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export { schema };
