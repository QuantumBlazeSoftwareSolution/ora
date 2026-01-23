ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'customer'::text;--> statement-breakpoint
DROP TYPE "public"."user_roles";--> statement-breakpoint
CREATE TYPE "public"."user_roles" AS ENUM('customer', 'merchant');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'customer'::"public"."user_roles";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."user_roles" USING "role"::"public"."user_roles";