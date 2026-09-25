"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

// Public pages use per-response CSP nonces and require server rendering.
// Fetch on navigation instead of spending hosting allowance on unseen pages.
export default function SiteLink(
  props: Omit<ComponentProps<typeof Link>, "prefetch">,
) {
  return (
    <Link
      {...props}
      prefetch={false}
      onClick={(event) => {
        props.onClick?.(event);
        const anchor = event.currentTarget;
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          (anchor.target && anchor.target !== "_self") ||
          anchor.hasAttribute("download") ||
          props.onNavigate ||
          !document.getElementById("picmagic-adsense")
        )
          return;
        const destination = new URL(anchor.href);
        if (
          destination.origin !== location.origin ||
          destination.pathname === location.pathname
        )
          return;
        // An executed advertising vendor cannot be unloaded by React. Navigate
        // once to a clean document instead of an RSC transition followed by reload.
        // Consent retains a fallback for imperative/history navigations.
        event.preventDefault();
        if (props.replace) location.replace(destination.href);
        else location.assign(destination.href);
      }}
    />
  );
}
