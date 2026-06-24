CREATE TABLE "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"pathname" text NOT NULL,
	"url" text NOT NULL,
	"content_type" text,
	"size" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"person" text NOT NULL,
	"quote" text NOT NULL,
	"model" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
