"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

// Public pages use per-response CSP nonces and require server rendering.
// Fetch on navigation instead of spending the Free allowance on unseen pages.
export default function SiteLink(
  props: Omit<ComponentProps<typeof Link>, "prefetch">,
) {
  return <Link {...props} prefetch={false} />;
}
