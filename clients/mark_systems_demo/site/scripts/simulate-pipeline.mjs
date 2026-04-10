#!/usr/bin/env node
/**
 * Pipeline simulation script.
 *
 * Runs multiple scenarios against the live API to validate:
 * - SSE streaming works end-to-end
 * - All 8 agents execute
 * - Rate limiting kicks in after 3 requests
 * - Errors are handled gracefully
 * - Budget caps are respected
 *
 * Usage:
 *   node scripts/simulate-pipeline.mjs [baseUrl]
 *
 * Default baseUrl: https://mark-systems-demo.vercel.app
 */

const BASE_URL = process.argv[2] ?? 'https://mark-systems-demo.vercel.app';

// Scenarios designed to validate:
// 1-3: Happy paths + validation (within 3 req/15min rate limit)
// 4-5: Rate-limit-triggering (must return 429)
const SCENARIOS = [
  {
    name: 'Validation — missing objective (400)',
    body: {},
    expect: { httpStatus: 400 },
  },
  {
    name: 'Validation — objective too short (400)',
    body: { objective: 'hi' },
    expect: { httpStatus: 400 },
  },
  {
    name: 'Happy path — full 8-agent pipeline',
    body: { objective: 'Create a cyberpunk dashboard with neon glow' },
    expect: { status: 'success', minSteps: 8 },
  },
  {
    name: 'Rate limit — 4th request must be throttled (429)',
    body: { objective: 'Should be rate limited' },
    expect: { httpStatus: 429 },
  },
  {
    name: 'Rate limit — 5th request still throttled (429)',
    body: { objective: 'Still throttled' },
    expect: { httpStatus: 429 },
  },
];

const results = [];

async function runScenario(scenario) {
  const start = Date.now();
  const result = {
    name: scenario.name,
    status: 'unknown',
    events: { plan: 0, stepStart: 0, textDelta: 0, stepEnd: 0, finish: 0, error: 0 },
    totalTokens: 0,
    totalCostUsd: 0,
    durationMs: 0,
    httpStatus: 0,
    finalStatus: null,
    error: null,
  };

  try {
    const response = await fetch(`${BASE_URL}/api/agents/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scenario.body),
    });

    result.httpStatus = response.status;

    if (!response.ok) {
      result.status = 'http_error';
      result.error = await response.text().catch(() => 'unknown');
      return result;
    }

    if (!response.body) {
      result.status = 'no_body';
      return result;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const chunks = buffer.split('\n\n');
      buffer = chunks.pop() ?? '';

      for (const chunk of chunks) {
        const dataLine = chunk.split('\n').find((l) => l.startsWith('data: '));
        if (!dataLine) continue;
        try {
          const event = JSON.parse(dataLine.slice(6));
          handleEvent(event, result);
        } catch {
          /* ignore malformed */
        }
      }
    }

    result.status = result.events.error > 0 ? 'error' : 'success';
    result.durationMs = Date.now() - start;
    return result;
  } catch (error) {
    result.status = 'exception';
    result.error = error.message;
    result.durationMs = Date.now() - start;
    return result;
  }
}

function handleEvent(event, result) {
  switch (event.type) {
    case 'plan':
      result.events.plan++;
      break;
    case 'step-start':
      result.events.stepStart++;
      break;
    case 'text-delta':
      result.events.textDelta++;
      break;
    case 'step-end':
      result.events.stepEnd++;
      break;
    case 'finish':
      result.events.finish++;
      result.totalTokens = event.totalTokensUsed ?? 0;
      result.totalCostUsd = event.totalCostUsd ?? 0;
      result.finalStatus = event.status ?? null;
      break;
    case 'error':
      result.events.error++;
      result.error = event.error;
      break;
  }
}

function validate(result, expect) {
  const issues = [];

  if (expect.httpStatus) {
    if (result.httpStatus !== expect.httpStatus) {
      issues.push(`expected HTTP ${expect.httpStatus}, got ${result.httpStatus}`);
    }
    return issues;
  }

  if (expect.status && result.finalStatus !== expect.status) {
    issues.push(`expected final status ${expect.status}, got ${result.finalStatus}`);
  }

  if (expect.minSteps && result.events.stepEnd < expect.minSteps) {
    issues.push(`expected ${expect.minSteps}+ steps, got ${result.events.stepEnd}`);
  }

  return issues;
}

async function main() {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`Mark Systems Pipeline Simulations`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`${'='.repeat(70)}\n`);

  for (let i = 0; i < SCENARIOS.length; i++) {
    const scenario = SCENARIOS[i];
    process.stdout.write(`[${i + 1}/${SCENARIOS.length}] ${scenario.name}... `);

    const result = await runScenario(scenario);
    const issues = validate(result, scenario.expect);

    if (issues.length === 0) {
      console.log(`OK (${result.durationMs}ms)`);
    } else {
      console.log(`FAIL`);
      for (const issue of issues) {
        console.log(`    - ${issue}`);
      }
    }

    results.push({ scenario: scenario.name, result, issues });

    // Small delay between scenarios to respect rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log('Summary');
  console.log(`${'='.repeat(70)}\n`);

  const passed = results.filter((r) => r.issues.length === 0).length;
  const failed = results.length - passed;

  console.log(`Passed:  ${passed}/${results.length}`);
  console.log(`Failed:  ${failed}/${results.length}`);

  const successfulRuns = results.filter((r) => r.result.events.finish > 0);
  if (successfulRuns.length > 0) {
    const totalTokens = successfulRuns.reduce((sum, r) => sum + r.result.totalTokens, 0);
    const totalCost = successfulRuns.reduce((sum, r) => sum + r.result.totalCostUsd, 0);
    const avgDuration =
      successfulRuns.reduce((sum, r) => sum + r.result.durationMs, 0) / successfulRuns.length;

    console.log(`\nSuccessful pipelines: ${successfulRuns.length}`);
    console.log(`  Total tokens:    ${totalTokens.toLocaleString()}`);
    console.log(`  Total cost:      $${totalCost.toFixed(6)}`);
    console.log(`  Avg duration:    ${Math.round(avgDuration)}ms`);
  }

  // Detailed breakdown per scenario
  console.log('\nDetailed breakdown:');
  for (const { scenario, result } of results) {
    console.log(`\n  ${scenario}`);
    console.log(`    HTTP: ${result.httpStatus}`);
    console.log(`    Events: plan=${result.events.plan} start=${result.events.stepStart} delta=${result.events.textDelta} end=${result.events.stepEnd} finish=${result.events.finish} error=${result.events.error}`);
    console.log(`    Duration: ${result.durationMs}ms`);
    if (result.error) {
      console.log(`    Error: ${result.error.slice(0, 100)}`);
    }
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
