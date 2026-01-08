CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled');--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."booking_status";--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "status" SET DATA TYPE "public"."booking_status" USING "status"::"public"."booking_status";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."order_status";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "status" SET DATA TYPE "public"."order_status" USING "status"::"public"."order_status";--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "stores" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;