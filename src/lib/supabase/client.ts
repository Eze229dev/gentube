import { createBrowserClient } from "@supabase/ssr";

import { requireSupabaseConfig } from "@/config/env";
import type { Database } from "@/types/database";

export function createClient() {
  const { url, anonKey } = requireSupabaseConfig();

  return createBrowserClient<Database>(url, anonKey);
}
