import Link from "@/components/ui/site-link";
import { PrivacyChoices } from "./privacy-choices";
import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { site } from "@/config/site";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Link href="/" className="wordmark" aria-label="PicMagic home">
            <BrandLogo />
          </Link>
          <p>
            A little inspiration.
            <br />A whole new way to see yourself.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <h2>Find your inspiration</h2>
            <Link href="/ai-prompts">Photo ideas</Link>
            <Link href="/collections">Curated collections</Link>
            <Link href="/enhance-photo">Enhance your photo</Link>
            <Link href="/reel-prompts">Reel ideas</Link>
            <Link href="/create">
              Create a prompt <ArrowUpRight size={13} />
            </Link>
          </div>
          <div>
            <h2>A little more</h2>
            <Link href="/about">About PicMagic</Link>
            <Link href="/guides/reference-photo-prompts">
              Reference-photo guide
            </Link>
            <Link href="/saved">Your saved looks</Link>
            <Link href="/contact">Get in touch</Link>
            {site.social.map(({ label, href }) => (
              <a key={label} href={href} rel="me">
                {label} <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} PicMagic. Made for your imagination.
        </span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <PrivacyChoices />
        </div>
      </div>
      <p className="fine-print">
        AI-generated examples. Results vary by tool. PicMagic creates prompts,
        not photos or videos.
      </p>
    </footer>
  );
}
