ALTER TABLE "subscriptions" ADD COLUMN "product_limit" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "service_limit" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "booking_limit" integer DEFAULT 0;