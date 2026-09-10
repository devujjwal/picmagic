import { hasSupabase } from "@/lib/supabase/server";
import { LoginForm } from "@/features/admin/login-form";
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="wizard">
      <header className="page-heading">
        <div className="eyebrow">PicMagic studio</div>
        <h1>A little magic, behind the scenes.</h1>
        <p>
          Administrator sign-in. Browsing PicMagic never requires an account.
        </p>
      </header>
      {hasSupabase() ? (
        <>
          {error === "forbidden" && (
            <p className="error-text" role="alert">
              Administrator access is required.
            </p>
          )}
          <LoginForm />
        </>
      ) : (
        <div className="notice">
          <h2 className="text-lg mb-3">Administrator setup is required</h2>
          <p>
            Connect the dedicated Supabase project and provision an
            administrator before signing in. The public local preview remains
            available.
          </p>
        </div>
      )}
    </div>
  );
}
