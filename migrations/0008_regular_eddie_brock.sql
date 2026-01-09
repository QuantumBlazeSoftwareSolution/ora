-- Clean up incompatible data
TRUNCATE TABLE "users", "stores", "bookings", "products", "services", "orders", "verifications", "subscriptions" CASCADE;

-- Drop FK Constraint
ALTER TABLE "stores" DROP CONSTRAINT IF EXISTS "stores_user_id_users_id_fk";

-- Update Users Table
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE uuid USING gen_random_uuid();
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- Update Stores Table (referencing users)
ALTER TABLE "stores" ALTER COLUMN "user_id" SET DATA TYPE uuid USING user_id::uuid;

-- Re-add FK Constraint
ALTER TABLE "stores" ADD CONSTRAINT "stores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;