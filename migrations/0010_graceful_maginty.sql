CREATE TABLE "business_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"applicant_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"store_name" text NOT NULL,
	"store_slug" text NOT NULL,
	"category_id" integer,
	"description" text,
	"subscription_id" integer,
	"nic_url" text,
	"business_reg_url" text,
	"status" "store_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "business_applications" ADD CONSTRAINT "business_applications_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "business_applications" ADD CONSTRAINT "business_applications_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;