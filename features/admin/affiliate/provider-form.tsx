"use client";
import { useActionState } from "react";
import { saveAffiliateProvider } from "./actions";
import {
  affiliateStatuses,
  accessLevels,
  capabilities,
  type AffiliateProvider,
} from "@/lib/affiliate/schema";
export function AffiliateProviderForm({
  provider: p,
}: {
  provider?: AffiliateProvider;
}) {
  const [state, action, pending] = useActionState(saveAffiliateProvider, {});
  return (
    <form action={action} className="affiliate-admin-form">
      <div className="form-grid">
        <label className="field">
          Provider ID
          <input
            name="id"
            defaultValue={p?.id}
            readOnly={!!p}
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            maxLength={80}
          />
          <small>
            New IDs remain quarantined until a trusted domain policy is added.
          </small>
        </label>
        <label className="field">
          Tool name
          <input name="name" defaultValue={p?.name} required maxLength={80} />
        </label>
        <label className="field wide">
          Description
          <input
            name="description"
            defaultValue={p?.description}
            required
            minLength={15}
            maxLength={240}
          />
        </label>
        <label className="field">
          Official URL
          <input
            name="official_url"
            type="url"
            defaultValue={p?.official_url}
            required
          />
        </label>
        <label className="field">
          Issued affiliate URL
          <input
            name="affiliate_url"
            type="url"
            defaultValue={p?.affiliate_url || ""}
          />
          <small>
            Leave empty until the provider issues a real URL. Never invent
            referral codes.
          </small>
        </label>
        <label className="field">
          Program URL
          <input
            name="program_url"
            type="url"
            defaultValue={p?.program_url || ""}
          />
        </label>
        <label className="field">
          Application status
          <select
            name="affiliate_status"
            defaultValue={p?.affiliate_status || "Researching"}
          >
            {affiliateStatuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Display priority
          <input
            name="priority"
            type="number"
            min={0}
            max={100}
            defaultValue={p?.priority ?? 50}
          />
          <small>
            Lower numbers first within equally suitable recommendations.
          </small>
        </label>
        <div>
          <label className="checkbox-field">
            <input
              name="is_enabled"
              type="checkbox"
              defaultChecked={p?.is_enabled}
            />
            Enable editorial recommendation
          </label>
          {["photo", "video"].map((m) => (
            <label className="checkbox-field" key={m}>
              <input
                name={`media_${m}`}
                type="checkbox"
                defaultChecked={
                  p?.media.includes(m as "photo" | "video") ?? m === "photo"
                }
              />
              {m === "photo" ? "Photo relevance" : "Video relevance"}
            </label>
          ))}
        </div>
      </div>
      <fieldset>
        <legend>Verified capabilities and visitor access</legend>
        {capabilities.map((c) => {
          const feature = p?.capabilities.find((f) => f.capability === c);
          return (
            <div className="affiliate-capability" key={c}>
              <label className="checkbox-field">
                <input
                  name={`cap_${c}`}
                  type="checkbox"
                  defaultChecked={!!feature}
                />
                {c.replaceAll("_", " ")}
              </label>
              <label className="field">
                Access for {c.replaceAll("_", " ")}
                <select
                  name={`access_${c}`}
                  defaultValue={feature?.access || "unknown"}
                >
                  {accessLevels.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                Limits for {c.replaceAll("_", " ")}
                <input
                  name={`note_${c}`}
                  defaultValue={feature?.note || ""}
                  maxLength={200}
                />
              </label>
            </div>
          );
        })}
      </fieldset>
      <label className="field">
        Official capability evidence URLs (one per line)
        <textarea
          name="evidence_urls"
          defaultValue={p?.evidence_urls.join("\n")}
          required
        />
      </label>
      <p className="fine-print">
        Feature review: {p?.last_verified_at || "New record"}. Claims expire
        after 30 days until rechecked.
      </p>
      <label className="checkbox-field">
        <input name="verify_features" type="checkbox" />I rechecked the official
        capability and access evidence today
      </label>
      <fieldset>
        <legend>Private commercial approval and URL review</legend>
        <label className="field">
          Acceptance evidence and confirmed program/product/geography
          <textarea
            name="approval_evidence"
            defaultValue={p?.approval_evidence || ""}
            maxLength={1000}
          />
          <small>
            Record acceptance details, not credentials, passwords or payment
            account information.
          </small>
        </label>
        <label className="checkbox-field">
          <input
            name="payout_confirmed"
            type="checkbox"
            defaultChecked={p?.payout_confirmed}
          />
          Indian publisher eligibility and cash payout method confirmed
        </label>
        <label className="checkbox-field">
          <input
            name="placement_confirmed"
            type="checkbox"
            defaultChecked={p?.placement_confirmed}
          />
          Content-page placement and promotion terms confirmed
        </label>
        <label className="checkbox-field">
          <input name="verify_link" type="checkbox" />I reviewed this exact
          saved URL, every redirect and the final provider destination
        </label>
        <p className="fine-print">
          URL verification: {p?.affiliate_url_verified_at || "Not verified"}.
          Save changed URLs before separately reviewing them. No automatic URL
          fetch, application or commercial acceptance occurs.
        </p>
      </fieldset>
      {state.error && (
        <p className="notice" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="notice" role="status">
          {state.success}
        </p>
      )}
      <button className="button" disabled={pending}>
        {pending ? "Saving…" : "Save provider"}
      </button>
    </form>
  );
}
