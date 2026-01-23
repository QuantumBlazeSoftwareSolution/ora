DO $$ BEGIN
 CREATE TYPE "public"."admin_status" AS ENUM('active', 'disabled', 'suspended');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "admin_users" ADD COLUMN "status" "admin_status" DEFAULT 'active';