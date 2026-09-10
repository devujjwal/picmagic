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
        browser’s localStorage. After analytics consent, a temporary list of
        visited public page paths is stored in sessionStorage for session-depth
        measurement. You can remove saves individually or clear this site’s
        browser data to remove all local records. These records are not synced
        to an account.
      </p>
      <h2>Optional analytics and advertising</h2>
      <p>
        Advertising helps fund PicMagic. We use Google AdSense on selected
        discovery and prompt pages when Google approves our site and supplies
        ads. The ad script loads only after you allow optional advertising
        cookies. Google and its advertising partners may use cookies or similar
        identifiers to deliver, measure and, where permitted, personalize ads.
        Rejecting optional cookies keeps the ad script disabled.
      </p>
      <p>
        Google Analytics 4 is enabled only after you allow optional analytics
        cookies. It measures public page views and actions such as copying or
        saving an idea, using cookie identifiers and ordinary browser/device
        information. Analytics permission is stored separately from advertising
        permission. We disable Google signals and advertising personalization
        for Analytics. We do not send prompt text, search terms, uploaded photos
        or contact details in these events. Page URLs omit query strings and
        fragments; external referrers are reduced to their origin. Admin pages
        are excluded. You can reopen cookie preferences to change your choice.
        Rejecting optional cookies leaves the core application functional.
      </p>
      <p>
        Google’s certified consent message provides additional advertising
        choices where required, including for visitors in the EEA, UK and
        Switzerland. Use its privacy settings link to revisit those choices, or
        PicMagic’s Cookie preferences control to withdraw permission to load
        advertising. See{" "}
        <a href="https://policies.google.com/technologies/partner-sites">
          how Google uses information from partner sites
        </a>{" "}
        and{" "}
        <a href="https://myadcenter.google.com/">
          Google’s ad personalization controls
        </a>
        .
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
