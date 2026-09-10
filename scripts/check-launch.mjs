// Build previews freely; fail a production deployment with incomplete launch configuration.
if (
  process.env.CONTEXT !== "production" &&
  !process.argv.includes("--production")
)
  process.exit(0);
const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_CONTACT_EMAIL",
  "NEXT_PUBLIC_OPERATOR_NAME",
];
const errors = required
  .filter((key) => !process.env[key]?.trim())
  .map((key) => `${key} is required`);
if (process.env.CONTENT_SOURCE !== "supabase")
  errors.push("Production must use CONTENT_SOURCE=supabase");
if (
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  )
)
  errors.push("Production requires a dedicated hosted Supabase project URL");
if (
  process.env.NEXT_PUBLIC_CONTACT_EMAIL &&
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.NEXT_PUBLIC_CONTACT_EMAIL)
)
  errors.push("A valid public contact email is required");
if (errors.length) {
  console.error(
    "Launch configuration is incomplete:\n" +
      errors.map((error) => `- ${error}`).join("\n"),
  );
  process.exit(1);
}
console.log("Production launch environment checks passed.");
