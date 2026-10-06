"use client";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { NoticeProvider } from "@/features/saved/store";
import { Consent } from "@/components/layout/consent";
import { WebVitals } from "@/components/analytics/web-vitals";
import {
  subscribeConsent,
  analyticsConsentKey,
  readConsent,
} from "@/lib/privacy/consent";
import { clearBlogAttribution } from "@/lib/analytics/blog-attribution";
export function ClientShell({
  children,
  nonce,
}: {
  children: React.ReactNode;
  nonce?: string;
}) {
  const pathname = usePathname();
  useEffect(() => {
    const clear = () => {
      if (
        readConsent(analyticsConsentKey) !== "yes" ||
        /^\/(admin|blog-preview)(\/|$)/.test(pathname)
      )
        clearBlogAttribution();
    };
    clear();
    return subscribeConsent(clear);
  }, [pathname]);
  const [notice, setNotice] = useState("");
  const notify = useCallback((message: string) => setNotice(message), []);
  useEffect(() => {
    if (notice) {
      const timer = setTimeout(() => setNotice(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [notice]);
  return (
    <NoticeProvider value={notify}>
      {children}
      <div
        className={`toast ${notice ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {notice}
      </div>
      <Consent nonce={nonce} />
      <WebVitals />
    </NoticeProvider>
  );
}
