"use client";

import dynamic from "next/dynamic";

const Toaster = dynamic(
  () => import("sonner").then((m) => ({ default: m.Toaster })),
  { ssr: false, loading: () => null }
);

const ScrollToTop = dynamic(
  () =>
    import("@/components/ui/ScrollToTop").then((m) => ({
      default: m.ScrollToTop,
    })),
  { ssr: false, loading: () => null }
);

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
