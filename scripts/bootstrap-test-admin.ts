import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (url !== "http://127.0.0.1:54421")
  throw new Error(
    "This bootstrap is restricted to the disposable PicMagic local backend.",
  );
const db = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const email = process.env.E2E_ADMIN_EMAIL!,
  password = process.env.E2E_ADMIN_PASSWORD!;
const {
  data: { users },
  error: listError,
} = await db.auth.admin.listUsers();
if (listError) throw listError;
const existing = users.find((u) => u.email === email);
const result = existing
  ? await db.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    })
  : await db.auth.admin.createUser({ email, password, email_confirm: true });
if (result.error || !result.data.user)
  throw new Error("Unable to create local test administrator");
const { error } = await db
  .from("admin_users")
  .upsert({ user_id: result.data.user.id });
if (error) throw error;
console.log(
  "Disposable local administrator is ready. Credentials remain in .env.qa.",
);
