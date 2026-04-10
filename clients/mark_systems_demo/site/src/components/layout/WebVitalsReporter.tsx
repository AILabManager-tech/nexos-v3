'use client';

import { useEffect } from 'react';

/**
 * Web Vitals reporter — collects LCP, CLS, INP, FCP, TTFB via the
 * Performance Observer API and logs them.
 *
 * Replace the console.log with a POST to /api/analytics/vitals when
 * ready to capture real user monitoring data.
 */
export default function WebVitalsReporter() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('PerformanceObserver' in window)) return;

    const metrics = new Map<string, number>();

    function report(name: string, value: number) {
      metrics.set(name, value);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`[vitals] ${name}: ${value.toFixed(2)}`);
      }
      // TODO: beacon to /api/analytics/vitals when endpoint is built
    }

    // LCP
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) report('LCP', last.startTime);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      /* not supported */
    }

    // CLS
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const e = entry as any;
          if (!e.hadRecentInput) {
            clsValue += e.value;
            report('CLS', clsValue);
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch {
      /* not supported */
    }

    // FCP / TTFB via navigation timing
    try {
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find((e) => e.name === 'first-contentful-paint');
      if (fcp) report('FCP', fcp.startTime);

      const nav = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming | undefined;
      if (nav) {
        report('TTFB', nav.responseStart - nav.requestStart);
      }
    } catch {
      /* not supported */
    }

    // INP via event timing (simplified)
    try {
      const inpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 0) {
            report('INP', entry.duration);
          }
        }
      });
      inpObserver.observe({ type: 'event', buffered: true });
    } catch {
      /* not supported */
    }
  }, []);

  return null;
}
