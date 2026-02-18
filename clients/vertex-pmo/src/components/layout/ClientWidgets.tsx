"use client";

import dynamic from "next/dynamic";
import { Toaster } from "sonner";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

const CookieConsent = dynamic(
  () =>
    import("@/components/legal/CookieConsent").then((m) => ({
      default: m.CookieConsent,
    })),
  { ssr: false, loading: () => null }
);

export function ClientWidgets() {
  return (
    <>
      <CookieConsent />
      <ScrollToTop />
      <Toaster richColors position="top-right" />
    </>
  );
}
