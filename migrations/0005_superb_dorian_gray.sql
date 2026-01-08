CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'LKR',
	"billing_period" text DEFAULT 'monthly',
	"description" text,
	"features" jsonb,
	"highlight" boolean DEFAULT false,
	"updated_at" text,
	CONSTRAINT "subscriptions_slug_unique" UNIQUE("slug")
);
