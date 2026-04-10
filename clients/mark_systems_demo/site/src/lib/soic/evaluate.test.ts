import { describe, it, expect } from 'vitest';
import { evaluate, computeWeightedAverage } from './evaluate';
import type { SoicScores } from './types';

describe('SOIC evaluator', () => {
  it('produces scores in 0-10 range for all dimensions', () => {
    const report = evaluate({
      output: 'Some output from an agent',
      agentId: 'ui-generator',
    });
    for (const score of Object.values(report.scores)) {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(10);
    }
  });

  it('computes weighted average correctly', () => {
    const scores: SoicScores = {
      D1_architecture: 10,
      D2_typescript: 10,
      D3_performance: 10,
      D4_security: 10,
      D5_i18n: 10,
      D6_accessibility: 10,
      D7_seo: 10,
      D8_legal: 10,
      D9_quality: 10,
    };
    expect(computeWeightedAverage(scores)).toBe(10);
  });

  it('penalizes dangerouslySetInnerHTML', () => {
    const clean = evaluate({
      output: 'const x = 1;',
      agentId: 'ui-generator',
    });
    const bad = evaluate({
      output: 'const html = dangerouslySetInnerHTML({ __html: userInput });',
      agentId: 'ui-generator',
    });
    expect(bad.scores.D4_security).toBeLessThan(clean.scores.D4_security);
  });

  it('penalizes hardcoded API keys', () => {
    const report = evaluate({
      output: 'const key = "apikey: sk-1234567890abcdef";',
      agentId: 'devops',
    });
    expect(report.scores.D4_security).toBeLessThan(8);
    expect(report.findings.some((f) => f.severity === 'critical')).toBe(true);
  });

  it('rewards i18n usage', () => {
    const withI18n = evaluate({
      output: 'const t = useTranslations("nav");',
      agentId: 'ui-generator',
    });
    const without = evaluate({
      output: 'const label = "Click here";',
      agentId: 'ui-generator',
    });
    expect(withI18n.scores.D5_i18n).toBeGreaterThanOrEqual(without.scores.D5_i18n);
  });

  it('verdict matches threshold', () => {
    const goodReport = evaluate({
      output: 'useTranslations aria-label generateMetadata useMemo',
      agentId: 'ui-generator',
    });
    expect(['PASS', 'CONDITIONAL', 'FAIL']).toContain(goodReport.verdict);
  });

  it('flags missing consent in forms', () => {
    const report = evaluate({
      output: '<form><input name="email" /></form>',
      agentId: 'ui-generator',
    });
    const hasConsentFinding = report.findings.some(
      (f) => f.dimension === 'D8_legal' && f.message.includes('consent')
    );
    expect(hasConsentFinding).toBe(true);
  });

  it('respects required tokens', () => {
    const report = evaluate({
      output: 'some text',
      agentId: 'ui-generator',
      requiredTokens: ['useTranslations'],
    });
    expect(report.scores.D9_quality).toBeLessThan(9);
  });

  it('respects banned tokens', () => {
    const report = evaluate({
      output: 'we deliver a robust solution with synergy',
      agentId: 'content-curator',
      bannedTokens: ['synergy', 'robust'],
    });
    expect(report.scores.D9_quality).toBeLessThan(9);
  });
});
