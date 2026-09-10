import Link from "next/link";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
export const metadata = makeMetadata(
  "Privacy | PicMagic",
  "How PicMagic handles local saves, optional analytics, advertising and administrator accounts.",
  "/privacy",
);
export default function Privacy() {
  return (
    <article className="container prose">
      <h1>Your privacy matters.</h1>
      <p>
        Updated 10 September 2026. This page describes PicMagic’s implemented
        data practices.
      </p>
      <h2>Photos and prompt creation</h2>
      <p>
        Public visitors do not upload photos to PicMagic. Guided prompt creation
        runs in your browser without sending your selections to an AI provider.
        When you open another AI tool, its privacy policy applies.
      </p>
      <h2>Saved looks and browsing history</h2>
      <p>
        Saved prompt IDs and up to 20 recently viewed IDs are stored in this
        browser’s localStorage. A temporary list of visited page paths is stored
        in sessionStorage for session-depth measurement. You can remove saves
        individually or clear this site’s browser data to remove all local
        records. These records are not synced to an account.
      </p>
      <h2>Optional analytics and advertising</h2>
      <p>
        When configured, optional Google Analytics and AdSense scripts load only
        after consent. Analytics events describe actions such as copying or
        saving an idea. We do not send prompt text, search terms, uploaded
        photos or contact details in these events. You can reopen cookie
        preferences to change your choice. Rejecting optional cookies leaves the
        core application functional.
      </p>
      <h2>Hosting and administration</h2>
      <p>
        Our hosting provider processes normal request information, such as IP
        address and browser headers, to deliver and secure the site. Supabase
        stores the editorial catalog and administrator authentication records.
        Administrator-uploaded preview images are public assets. Administrators
        should not upload private personal images.
      </p>
      <h2>No fingerprinting</h2>
      <p>
        PicMagic does not fingerprint visitors or require a public account.
        Local data stays until you remove it or your browser clears it. Provider
        log retention follows the applicable hosting and service settings.
      </p>
      <h2>Questions</h2>
      <p>
        See our <Link href="/contact">contact page</Link> for the published
        operator contact. You can also manage cookies and site storage directly
        through your browser.
      </p>
    </article>
  );
}
