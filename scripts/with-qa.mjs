import { loadEnvFile } from "node:process";
import { spawn } from "node:child_process";
loadEnvFile(".env.qa");
if (process.env.NEXT_PUBLIC_SUPABASE_URL !== "http://127.0.0.1:54421")
  throw new Error("QA is restricted to the disposable PicMagic local backend.");
const [command, ...args] = process.argv.slice(2);
if (!command) throw new Error("Provide a command and arguments");
const child = spawn(command, args, { stdio: "inherit", env: process.env });
child.on("exit", (code) => process.exit(code ?? 1));
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
