ALTER TABLE "stores" ADD COLUMN "subscription_id" integer;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" DROP COLUMN "subscription_plan";