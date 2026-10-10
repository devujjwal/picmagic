// Run via scripts/with-qa.mjs. Reuses only the disposable local backend.
import { spawn } from "node:child_process";
if (process.env.NEXT_PUBLIC_SUPABASE_URL !== "http://127.0.0.1:54421")
  throw new Error("Disposable local backend required");
const [command, ...args] = process.argv.slice(2);
if (!command) throw new Error("Provide a local command");
const env = {
  ...process.env,
  CONTENT_SOURCE: "supabase",
  PICMAGIC_DIST_DIR: ".next-affiliate-qa",
  NEXT_PUBLIC_GA_ID: "G-AFFQA12345",
  E2E_GA_ENABLED: "true",
  NEXT_PUBLIC_ADS_ENABLED: "false",
  NEXT_PUBLIC_ADSENSE_CLIENT: "",
  AFFILIATE_MONETIZATION_ENABLED: "false",
  E2E_BASE_URL: "http://localhost:4315",
  NEXT_PUBLIC_SITE_URL: "http://localhost:4315",
  ADMIN_ALLOWED_ORIGINS: "http://localhost:4315",
  NEXT_PUBLIC_INDEXING_ENABLED: "true",
};
delete env.CONTEXT;
const child = spawn(command, args, { stdio: "inherit", env });
child.on("exit", (code) => process.exit(code ?? 1));
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
