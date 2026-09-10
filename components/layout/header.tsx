import Link from "@/components/ui/site-link";
import {
  Bookmark,
  Search,
  Menu,
  Sparkles,
  ArrowUpRight,
  House,
  Images,
  Clapperboard,
  SlidersHorizontal,
} from "lucide-react";
import { navigation } from "@/config/site";
export function Header() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="wordmark" aria-label="PicMagic home">
            <span className="brand-mark">
              <Sparkles size={21} strokeWidth={1.7} />
            </span>
            PicMagic<span className="brand-dot">.</span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((n) => (
              <Link key={n.href} href={n.href}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link
              href="/search"
              className="icon-button"
              aria-label="Search photo ideas"
            >
              <Search size={20} />
            </Link>
            <Link href="/saved" className="saved-link">
              <Bookmark size={19} />
              <span>Saved</span>
            </Link>
            <Link href="/create" className="button small header-create">
              Make some magic <ArrowUpRight size={16} />
            </Link>
            <details className="mobile-menu">
              <summary aria-label="Open navigation">
                <Menu size={22} />
              </summary>
              <nav aria-label="Mobile menu">
                {navigation.map((n) => (
                  <Link key={n.href} href={n.href}>
                    {n.label}
                  </Link>
                ))}
                <Link href="/saved">Saved looks</Link>
              </nav>
            </details>
          </div>
        </div>
      </header>
      <nav className="bottom-nav" aria-label="Mobile navigation">
        <Link href="/">
          <House size={19} />
          Home
        </Link>
        <Link href="/ai-prompts">
          <Images size={19} />
          Explore
        </Link>
        <Link href="/enhance-photo">
          <SlidersHorizontal size={19} />
          Enhance
        </Link>
        <Link href="/reel-prompts">
          <Clapperboard size={19} />
          Reels
        </Link>
        <Link href="/saved">
          <Bookmark size={19} />
          Saved
        </Link>
      </nav>
    </>
  );
}
