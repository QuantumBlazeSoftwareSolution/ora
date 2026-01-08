CREATE TYPE "public"."store_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."user_roles" AS ENUM('admin', 'customer', 'merchant');--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"store_id" integer NOT NULL,
	"document_url" text,
	"admin_notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_roles" DEFAULT 'customer' NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "status" "store_status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "verifications" ADD CONSTRAINT "verifications_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;