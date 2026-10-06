import { spawn } from "node:child_process";
// Human review uses local seed data, no backend credentials, no vendors and no publication.
const env = {
  ...process.env,
  CONTENT_SOURCE: "seed",
  PICMAGIC_BLOG_PREVIEW: "true",
  PICMAGIC_DIST_DIR: ".next-blog-preview",
  NEXT_PUBLIC_SUPABASE_URL: "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
  SUPABASE_SERVICE_ROLE_KEY: "",
  NEXT_PUBLIC_GA_ID: "",
  NEXT_PUBLIC_ADSENSE_CLIENT: "",
  NEXT_PUBLIC_ADS_ENABLED: "false",
  NEXT_PUBLIC_INDEXING_ENABLED: "false",
};
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "dev",
    "--hostname",
    "127.0.0.1",
    "--port",
    "4312",
  ],
  { stdio: "inherit", env },
);
child.on("exit", (code) => process.exit(code ?? 1));
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
