# teszt

Next.js (App Router, TypeScript) alkalmazás három Vercel-integrációval:

- **Vercel Blob** — fájltárolás (`@vercel/blob`)
- **Vercel Neon** — Postgres adatbázis **Drizzle ORM**-mel (`drizzle-orm`, `@neondatabase/serverless`)
- **Vercel AI Gateway** — modell-hívások egységes átjárón át (`ai`, `@ai-sdk/gateway`)

## Oldalak / végpontok

| Útvonal       | Mit csinál                                                              |
| ------------- | ---------------------------------------------------------------------- |
| `/`           | Kezdőlap + a stack állapota (mely integráció van konfigurálva)         |
| `/files`      | Fájlfeltöltés Blobra, metaadat mentése Neonba, lista                   |
| `/ai`         | Egyszerű playground szöveggeneráláshoz az AI Gateway-en át             |
| `POST /api/ai`| Szöveggenerálás végpont (`{ "prompt": "...", "model": "provider/model" }`) |

## Indítás

```bash
npm install
cp .env.example .env.local   # töltsd ki az értékeket
npm run dev
```

Megnyitás: [http://localhost:3000](http://localhost:3000).

> Megjegyzés: a Node.js a `~/.local/bin` alatt van telepítve. Ha az `npm` nem
> található, add a PATH-hoz: `export PATH="$HOME/.local/bin:$PATH"`.

## Környezeti változók

Lásd [`.env.example`](.env.example). Vercelen ezeket a Storage/AI Gateway
felületei automatikusan beállítják; helyben a `.env.local`-ba kerülnek.

| Változó                 | Mihez kell             |
| ----------------------- | ---------------------- |
| `DATABASE_URL`          | Neon Postgres kapcsolat |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob feltöltés   |
| `AI_GATEWAY_API_KEY`    | Vercel AI Gateway       |
| `AI_GATEWAY_MODEL`      | (opcionális) alapértelmezett modell |

## Adatbázis (Drizzle)

A séma: [`lib/db/schema.ts`](lib/db/schema.ts). Drizzle Kit parancsok:

```bash
npm run db:generate   # SQL migrációk generálása a sémából
npm run db:push       # séma közvetlen szinkronizálása az adatbázisba
npm run db:studio     # Drizzle Studio (böngészős adatbázis-nézegető)
```

## Felépítés

```
app/
  page.tsx            # kezdőlap + stack-státusz
  files/              # Blob feltöltés + Neon lista (Server Action)
  ai/                 # AI Gateway playground (client) + /api/ai route
lib/db/               # Drizzle kliens (lusta init) + séma
drizzle.config.ts     # Drizzle Kit konfiguráció
```
