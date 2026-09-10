"use client";
import { useCallback, useEffect, useState } from "react";
import { NoticeProvider } from "@/features/saved/store";
import { Consent } from "@/components/layout/consent";
export function ClientShell({ children }: { children: React.ReactNode }) {
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
      <Consent />
    </NoticeProvider>
  );
}
