import { requireAdmin } from "@/lib/supabase/server";
import { providerSchema } from "@/lib/affiliate/schema";
import { AffiliateProviderForm } from "@/features/admin/affiliate/provider-form";
export default async function AffiliateToolsAdmin() {
  const { db } = await requireAdmin();
  const { data, error } = await db
    .from("affiliate_providers")
    .select("*")
    .order("priority")
    .order("name");
  return (
    <>
      <div className="admin-title">
        <h1>Affiliate Tools</h1>
      </div>
      <p className="notice">
        {process.env.AFFILIATE_MONETIZATION_ENABLED === "true"
          ? "Only approved, verified links can be monetized."
          : "Monetization is disabled in this environment. Enabled tools use ordinary official links."}{" "}
        Applications and agreements are handled by the owner; this page never
        submits them.
      </p>
      {error ? (
        <p role="alert" className="notice">
          Affiliate storage is unavailable. Apply the reviewed migration to the
          disposable local backend for QA. Production changes need separate
          authorization.
        </p>
      ) : (
        <>
          {(data || []).map((row) => {
            const parsed = providerSchema.safeParse(row);
            return parsed.success ? (
              <details key={row.id} className="affiliate-admin-record">
                <summary>
                  {row.name} · {row.affiliate_status} ·{" "}
                  {row.is_enabled ? "Enabled" : "Disabled"}
                </summary>
                <AffiliateProviderForm provider={parsed.data} />
              </details>
            ) : (
              <p key={row.id} role="alert">
                Invalid provider record: {row.id}. Repair its schema before use.
              </p>
            );
          })}
          <details className="affiliate-admin-record">
            <summary>Add provider</summary>
            <AffiliateProviderForm />
          </details>
        </>
      )}
    </>
  );
}
