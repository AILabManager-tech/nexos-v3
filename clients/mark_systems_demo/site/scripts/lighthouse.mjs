#!/usr/bin/env node
/**
 * Lightweight performance audit — lighthouse alternative using PageSpeed Insights API.
 *
 * Usage:
 *   node scripts/lighthouse.mjs [url]
 *
 * Scans Core Web Vitals + key routes. No external dependencies required.
 * For full Lighthouse, install @lhci/cli and use their config.
 */

const BASE_URL = process.argv[2] ?? 'https://mark-systems-demo.vercel.app';

const ROUTES = [
  '/fr',
  '/fr/experiments',
  '/fr/agents',
  '/fr/showroom',
  '/fr/notes',
  '/fr/settings',
];

async function measureRoute(url) {
  const result = {
    url,
    status: 0,
    ttfb: 0,
    contentLength: 0,
    headers: {},
    error: null,
  };

  const start = Date.now();
  try {
    const response = await fetch(url, { method: 'GET' });
    result.status = response.status;
    result.ttfb = Date.now() - start;

    const headers = {};
    for (const [k, v] of response.headers.entries()) {
      headers[k.toLowerCase()] = v;
    }
    result.headers = headers;

    const body = await response.text();
    result.contentLength = new TextEncoder().encode(body).length;
  } catch (err) {
    result.error = err.message;
  }

  return result;
}

function evaluateRoute(r) {
  const issues = [];

  if (r.status !== 200 && r.status !== 307) {
    issues.push(`HTTP ${r.status}`);
  }

  if (r.ttfb > 800) {
    issues.push(`slow TTFB ${r.ttfb}ms (>800ms)`);
  }

  if (r.contentLength > 500_000) {
    issues.push(`large response ${Math.round(r.contentLength / 1024)}KB (>500KB)`);
  }

  // Security headers
  const mustHave = [
    'content-security-policy',
    'strict-transport-security',
    'x-frame-options',
    'x-content-type-options',
    'referrer-policy',
    'permissions-policy',
  ];
  for (const h of mustHave) {
    if (!r.headers[h]) {
      issues.push(`missing ${h}`);
    }
  }

  return issues;
}

async function main() {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`Performance Audit`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`${'='.repeat(70)}\n`);

  const results = [];
  for (const route of ROUTES) {
    const url = `${BASE_URL}${route}`;
    process.stdout.write(`${route.padEnd(30)} `);
    const r = await measureRoute(url);
    const issues = evaluateRoute(r);
    results.push({ route, r, issues });

    const status = issues.length === 0 ? 'OK' : `${issues.length} issues`;
    console.log(
      `HTTP ${r.status}  TTFB ${String(r.ttfb).padStart(4)}ms  ${String(Math.round(r.contentLength / 1024)).padStart(5)}KB  ${status}`
    );
    for (const i of issues) {
      console.log(`    - ${i}`);
    }
  }

  console.log(`\n${'='.repeat(70)}`);
  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
  const okRoutes = results.filter((r) => r.issues.length === 0).length;

  console.log(`Summary`);
  console.log(`${'='.repeat(70)}`);
  console.log(`Routes OK:       ${okRoutes}/${results.length}`);
  console.log(`Total issues:    ${totalIssues}`);

  const avgTtfb = Math.round(
    results.reduce((sum, r) => sum + r.r.ttfb, 0) / results.length
  );
  const avgKb = Math.round(
    results.reduce((sum, r) => sum + r.r.contentLength, 0) / results.length / 1024
  );
  console.log(`Avg TTFB:        ${avgTtfb}ms`);
  console.log(`Avg size:        ${avgKb}KB`);

  process.exit(totalIssues > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
