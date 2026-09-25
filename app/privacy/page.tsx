import Link from "@/components/ui/site-link";
import { metadata as makeMetadata } from "@/lib/seo/metadata";
import { discoveryRotationEnabled } from "@/config/discovery";
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
        Updated 25 September 2026. This page describes PicMagic’s implemented
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
      {discoveryRotationEnabled() && (
        <>
          <h2 id="discovery-memory">Fresh mix on return visits</h2>
          <p>
            When this feature is enabled, PicMagic remembers discovery visits by
            default in a first-party cookie for up to 30 days after your last
            public page navigation. It stores the setting version, your on/off
            choice, a bounded rotation counter and the last navigation time
            rounded to a minute. Our server reads it to choose a different mix
            after a 30-minute break when you return to Home or the first Explore
            page. It does not contain a visitor identifier, viewed-prompt
            history or account information, and we do not pass it to analytics
            or advertising providers.
          </p>
          <p>
            Turn off “Fresh mix on return visits” on Home or Explore to restore
            the editorial order. We retain the off preference in the same
            cookie. Clear this site’s cookies to remove it; blocking cookies
            keeps the editorial order. This setting is separate from analytics
            and advertising choices.
          </p>
        </>
      )}
      <h2>Optional analytics and advertising</h2>
      <p>
        Advertising helps fund PicMagic. We use Google AdSense on selected
        discovery and prompt pages when Google approves our site and supplies
        ads. Google’s Privacy &amp; Messaging consent management platform
        manages advertising choices and applicable regional consent signals,
        including the IAB Transparency and Consent Framework for visitors in the
        EEA, UK and Switzerland. The advertising tag loads to support that
        process; loading it does not itself mean you have consented to
        personalized ads.
      </p>
      <p>
        Where permitted by your choices and applicable requirements, Google may
        serve personalized ads. If you reject personalization, Google may
        instead serve non-personalized or limited ads, or no ad.
        Non-personalized ads can still use cookies for purposes such as
        frequency capping and measurement and require consent where applicable.
        Limited ads do not use personal data for personalization; normal
        delivery can still process information such as your IP address. Google’s
        programmatic limited ads may use fraud-prevention-only cookies and local
        storage. Eligibility depends on Google’s consent signals, transparency
        requirements and publisher settings. Rejecting consent never authorizes
        personalized advertising.
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
        Use Cookie preferences in the footer to open Google’s applicable
        advertising privacy choices and separately manage optional analytics.
        Google’s own regional privacy or “Do not sell or share” links may also
        appear. No advertising choice grants analytics permission. An earlier
        rejection in PicMagic’s former advertising-cookie banner is retained: ad
        requests stay paused until a new explicit Google CMP choice replaces it.
        If Google’s controls cannot load, that earlier rejection stays in
        effect. See{" "}
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
