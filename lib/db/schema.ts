import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

/**
 * Metadata for files uploaded to Vercel Blob.
 * The binary lives in Blob storage; this row records where it is and what it is.
 */
export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  pathname: text("pathname").notNull(),
  url: text("url").notNull(),
  contentType: text("content_type"),
  size: integer("size").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type FileRecord = typeof files.$inferSelect;
export type NewFileRecord = typeof files.$inferInsert;

/**
 * AI-generated quotes. A visitor enters a famous person's name; the AI Gateway
 * returns one of their quotes, which is stored here.
 */
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  person: text("person").notNull(),
  quote: text("quote").notNull(),
  model: text("model"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type QuoteRecord = typeof quotes.$inferSelect;
export type NewQuoteRecord = typeof quotes.$inferInsert;
