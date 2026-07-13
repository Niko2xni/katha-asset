import { createClient } from "@supabase/supabase-js";

// Safe public supabase client configuration for realtime subscriptions
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://svoelhxgpwropsgyqisk.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWZlcmVuY2UtaWQiOiJzdm9lbGh4Z3B3cm9wc2d5cWlzayIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzEzODg5NzI5LCJleHAiOjIwMjk0NjU3Mjl9.mock";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
