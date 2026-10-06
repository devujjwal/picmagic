import Link from "next/link";
import { requireAdmin } from "@/lib/supabase/server";
import { logout } from "@/features/admin/actions";
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="admin-shell">
      <nav className="admin-nav" aria-label="Administration">
        <Link href="/admin">Overview</Link>
        <Link href="/admin/blog">Blog & Lab</Link>
        <Link href="/admin/prompts">Prompts</Link>
        <Link href="/admin/categories">Categories</Link>
        <Link href="/admin/collections">Collections</Link>
        <Link href="/admin/seasonal">Seasonal</Link>
        <form action={logout} className="ml-auto">
          <button type="submit">Sign out</button>
        </form>
      </nav>
      {children}
    </div>
  );
}
