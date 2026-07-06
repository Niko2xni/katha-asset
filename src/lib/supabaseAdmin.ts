import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    throw new Error("Critical Configuration Deficit: Supabase administrative environment tokens are missing");
}

// Service role client handles high-privilege server actions safely
export const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    {
        auth: {
        persistSession: false, // Prevents serverless state sharing conflicts
        },
    }
);