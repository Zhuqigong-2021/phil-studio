import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

const CONFIGURATION_ERROR_MESSAGE =
  "Supabase server configuration is unavailable.";

export class SupabaseConfigurationError extends Error {
  constructor() {
    super(CONFIGURATION_ERROR_MESSAGE);
    this.name = "SupabaseConfigurationError";
  }
}

function getServerConfiguration(): { url: string; secret: string } {
  const url = process.env.SUPABASE_URL?.trim();
  const secret = process.env.SUPABASE_SECRET_KEY?.trim();

  if (!url || !secret) {
    throw new SupabaseConfigurationError();
  }

  try {
    if (new URL(url).protocol !== "https:") {
      throw new SupabaseConfigurationError();
    }
  } catch {
    throw new SupabaseConfigurationError();
  }

  return { url, secret };
}

export function getSupabaseServerClient(): SupabaseClient<Database> {
  const { url, secret } = getServerConfiguration();

  return createClient<Database>(url, secret, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
