// Runs Drizzle migrations before the Next.js build.
// Skips gracefully when DATABASE_URL is not set (e.g. local builds without a DB),
// so `next build` still works; on Vercel (where DATABASE_URL is configured) it
// applies any pending migrations from ./drizzle.
import { execSync } from "node:child_process";
import path from "node:path";

if (!process.env.DATABASE_URL) {
  console.log("[migrate] DATABASE_URL not set — skipping migrations.");
  process.exit(0);
}

console.log("[migrate] Applying Drizzle migrations…");

// Ensure the local drizzle-kit binary resolves regardless of how this runs.
const binDir = path.join(process.cwd(), "node_modules", ".bin");
execSync("drizzle-kit migrate", {
  stdio: "inherit",
  env: {
    ...process.env,
    PATH: `${binDir}${path.delimiter}${process.env.PATH ?? ""}`,
  },
});
