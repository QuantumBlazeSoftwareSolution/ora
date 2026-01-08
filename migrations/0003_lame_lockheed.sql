CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"image_url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "category_id" integer;--> statement-breakpoint
ALTER TABLE "verifications" ADD COLUMN "nic_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "verifications" ADD COLUMN "business_reg_url" text;--> statement-breakpoint
ALTER TABLE "verifications" ADD COLUMN "other_doc_url" text;--> statement-breakpoint
ALTER TABLE "verifications" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verifications" DROP COLUMN "document_url";