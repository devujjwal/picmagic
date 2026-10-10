import { createClient } from "@supabase/supabase-js";
import { affiliateProviderSeeds } from "../content/affiliate/providers";
if (process.env.NEXT_PUBLIC_SUPABASE_URL !== "http://127.0.0.1:54421")
  throw new Error(
    "Affiliate fixtures are restricted to the disposable local backend",
  );
const db = createClient(
  "http://127.0.0.1:54421",
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);
const { error } = await db
  .from("affiliate_providers")
  .upsert(affiliateProviderSeeds);
if (error) throw new Error("Unable to prepare local affiliate fixtures");
console.log(
  "Local ordinary-link provider fixtures ready. No affiliate URL or approval configured.",
);
