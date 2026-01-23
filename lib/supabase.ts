import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
// access credentials from process.env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validate config
if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Supabase configuration missing across the application. Please check your .env file.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
