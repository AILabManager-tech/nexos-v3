"use client";

/**
 * NEXOS v3.0 — AdSense Ad Unit Component Template
 *
 * Instructions pour integration-engineer :
 * 1. Copier vers site/src/components/AdUnit.tsx
 * 2. Remplacer NEXT_PUBLIC_ADSENSE_ID dans .env.local
 * 3. Ajouter le script AdSense dans le layout racine :
 *    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ADSENSE_ID}}" crossOrigin="anonymous" />
 * 4. Placer les <AdUnit> dans les pages (après hero, entre sections)
 * 5. Le composant retourne null si pas de ADSENSE_ID configuré
 *
 * IMPORTANT — CSP :
 * Le next.config.js / vercel.json DOIT inclure ces domaines dans la CSP :
 * - script-src: https://pagead2.googlesyndication.com https://adservice.google.com
 *   https://www.googletagservices.com https://tpc.googlesyndication.com
 * - img-src: https://pagead2.googlesyndication.com https://*.google.com https://*.doubleclick.net
 * - frame-src: https://googleads.g.doubleclick.net https://tpc.googlesyndication.com
 * - connect-src: https://pagead2.googlesyndication.com https://*.google.com
 */

import { useEffect, useRef } from "react";

type AdFormat = "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";

interface AdUnitProps {
  /** Slot ID from AdSense dashboard (e.g., "1234567890") */
  slot: string;
  /** Ad format — "auto" is recommended for responsive */
  format?: AdFormat;
  /** Enable responsive sizing (default: true) */
  responsive?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

export default function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!adsenseId || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet — silent fail
    }
  }, [adsenseId]);

  // No ADSENSE_ID configured — render nothing
  if (!adsenseId) return null;

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(responsive && { "data-full-width-responsive": "true" })}
      />
    </div>
  );
}
