import Link from "next/link";
import { PrivacyChoices } from "./privacy-choices";
import { Sparkles, ArrowUpRight } from "lucide-react";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Link href="/" className="wordmark">
            <Sparkles size={23} />
            PicMagic.
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
            <Link href="/enhance-photo">Enhance your photo</Link>
            <Link href="/reel-prompts">Reel ideas</Link>
            <Link href="/create">
              Create a prompt <ArrowUpRight size={13} />
            </Link>
          </div>
          <div>
            <h2>A little more</h2>
            <Link href="/about">About PicMagic</Link>
            <Link href="/saved">Your saved looks</Link>
            <Link href="/contact">Get in touch</Link>
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
