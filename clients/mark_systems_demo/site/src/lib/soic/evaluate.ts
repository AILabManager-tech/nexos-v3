/**
 * SOIC evaluator — scores an agent output against 9 dimensions.
 *
 * Heuristics-based scoring (no external calls). For production-grade
 * evaluation, integrate with `/home/gear-code/projects/soic/soic_v3/evaluate.py`
 * via a Python bridge when Gencore is deployed.
 */
import { SOIC_DIMENSIONS, type SoicScores, type SoicFinding, type SoicReport } from './types';

const DEFAULT_THRESHOLD = 8.5;

export interface EvaluateInput {
  output: string;
  agentId: string;
  /** Optional: expected output length range */
  expectedLength?: { min: number; max: number };
  /** Optional: must contain these tokens */
  requiredTokens?: string[];
  /** Optional: must NOT contain these tokens (banned lexicon) */
  bannedTokens?: string[];
}

/**
 * Heuristic scoring — returns a SoicReport for an agent output.
 *
 * This is a lightweight evaluator. Real production scoring should call
 * the Python SOIC evaluator via the Gencore bridge.
 */
export function evaluate(input: EvaluateInput): SoicReport {
  const findings: SoicFinding[] = [];
  const { output } = input;
  const len = output.length;

  const scores: SoicScores = {
    D1_architecture: scoreArchitecture(output, findings),
    D2_typescript: scoreTypeScript(output, findings),
    D3_performance: scorePerformance(output, findings),
    D4_security: scoreSecurity(output, findings),
    D5_i18n: scoreI18n(output, findings),
    D6_accessibility: scoreA11y(output, findings),
    D7_seo: scoreSeo(output, findings),
    D8_legal: scoreLegal(output, findings),
    D9_quality: scoreQuality(output, len, input, findings),
  };

  const weightedAverage = computeWeightedAverage(scores);
  const verdict: SoicReport['verdict'] =
    weightedAverage >= DEFAULT_THRESHOLD
      ? 'PASS'
      : weightedAverage >= DEFAULT_THRESHOLD - 1
        ? 'CONDITIONAL'
        : 'FAIL';

  return {
    scores,
    weightedAverage: Math.round(weightedAverage * 100) / 100,
    verdict,
    threshold: DEFAULT_THRESHOLD,
    findings,
    evaluatedAt: new Date().toISOString(),
  };
}

export function computeWeightedAverage(scores: SoicScores): number {
  let weighted = 0;
  let totalWeight = 0;
  for (const [key, { weight }] of Object.entries(SOIC_DIMENSIONS)) {
    const score = scores[key as keyof SoicScores] ?? 0;
    weighted += score * weight;
    totalWeight += weight;
  }
  return totalWeight > 0 ? weighted / totalWeight : 0;
}

// ============================================================
// Dimension scorers — each returns 0..10
// ============================================================

function scoreArchitecture(output: string, findings: SoicFinding[]): number {
  let score = 9;
  // Penalize anti-patterns
  if (output.includes('any')) {
    score -= 1;
    findings.push({
      dimension: 'D1_architecture',
      severity: 'low',
      message: 'Output contains `any` type',
    });
  }
  if (output.match(/\bclass\s+\w+/)) score += 0.5; // Proper classes = good
  return clamp(score);
}

function scoreTypeScript(output: string, findings: SoicFinding[]): number {
  let score = 9;
  if (output.includes(': any') || output.includes('as any')) {
    score -= 2;
    findings.push({
      dimension: 'D2_typescript',
      severity: 'medium',
      message: 'Uses `any` — prefer strict types',
    });
  }
  return clamp(score);
}

function scorePerformance(output: string, _findings: SoicFinding[]): number {
  let score = 8.5;
  if (output.includes('useMemo') || output.includes('useCallback')) score += 0.5;
  if (output.includes('dynamic(') || output.includes('lazy(')) score += 0.5;
  return clamp(score);
}

function scoreSecurity(output: string, findings: SoicFinding[]): number {
  let score = 9.5;
  if (output.includes('dangerouslySetInnerHTML')) {
    score -= 3;
    findings.push({
      dimension: 'D4_security',
      severity: 'high',
      message: 'Uses dangerouslySetInnerHTML without sanitization',
    });
  }
  // Detect hardcoded API keys in common formats
  if (
    output.match(/api[_-]?key\s*[:=]\s*['"`]?[a-zA-Z0-9-_]{10,}/i) ||
    output.match(/\bsk-[a-zA-Z0-9-_]{10,}/) ||
    output.match(/\bBearer\s+[a-zA-Z0-9-_.]{20,}/)
  ) {
    score -= 5;
    findings.push({
      dimension: 'D4_security',
      severity: 'critical',
      message: 'Hardcoded API key detected in output',
    });
  }
  if (output.includes('eval(')) {
    score -= 2;
    findings.push({
      dimension: 'D4_security',
      severity: 'high',
      message: 'Uses eval() — code injection risk',
    });
  }
  return clamp(score);
}

function scoreI18n(output: string, _findings: SoicFinding[]): number {
  let score = 8;
  if (output.includes('useTranslations') || output.includes('getTranslations')) score += 1;
  if (output.match(/['"`](Click here|Submit|Cancel|Save|Delete)['"`]/i)) score -= 1;
  return clamp(score);
}

function scoreA11y(output: string, findings: SoicFinding[]): number {
  let score = 8.5;
  if (output.includes('aria-label') || output.includes('aria-labelledby')) score += 0.5;
  if (output.match(/<img(?![^>]*\balt=)/)) {
    score -= 1.5;
    findings.push({
      dimension: 'D6_accessibility',
      severity: 'medium',
      message: 'Image without alt text',
    });
  }
  if (output.includes('onClick') && !output.match(/role=|aria-label=/)) {
    // onClick on a div without role/label is suspicious
    if (output.match(/<div[^>]*onClick/)) score -= 1;
  }
  return clamp(score);
}

function scoreSeo(output: string, _findings: SoicFinding[]): number {
  let score = 8;
  if (output.includes('generateMetadata') || output.includes('<title>')) score += 1;
  return clamp(score);
}

function scoreLegal(output: string, findings: SoicFinding[]): number {
  let score = 9;
  // Check for any hint of Loi 25 awareness
  if (output.match(/\b(Loi\s*25|Law\s*25|Bill\s*25|GDPR|privacy)\b/i)) score += 0.5;
  // Check for consent absence in forms
  if (output.match(/<form/) && !output.match(/consent/i)) {
    score -= 1;
    findings.push({
      dimension: 'D8_legal',
      severity: 'medium',
      message: 'Form without consent field',
    });
  }
  return clamp(score);
}

function scoreQuality(
  output: string,
  len: number,
  input: EvaluateInput,
  findings: SoicFinding[]
): number {
  let score = 9;

  // Length check
  if (input.expectedLength) {
    if (len < input.expectedLength.min) {
      score -= 2;
      findings.push({
        dimension: 'D9_quality',
        severity: 'medium',
        message: `Output too short (${len} chars, expected ${input.expectedLength.min}+)`,
      });
    } else if (len > input.expectedLength.max) {
      score -= 1;
      findings.push({
        dimension: 'D9_quality',
        severity: 'low',
        message: `Output too long (${len} chars, expected <${input.expectedLength.max})`,
      });
    }
  }

  // Required tokens
  if (input.requiredTokens) {
    for (const token of input.requiredTokens) {
      if (!output.includes(token)) {
        score -= 1;
        findings.push({
          dimension: 'D9_quality',
          severity: 'medium',
          message: `Missing required token: ${token}`,
        });
      }
    }
  }

  // Banned tokens
  if (input.bannedTokens) {
    for (const token of input.bannedTokens) {
      if (output.toLowerCase().includes(token.toLowerCase())) {
        score -= 1;
        findings.push({
          dimension: 'D9_quality',
          severity: 'low',
          message: `Contains banned token: ${token}`,
        });
      }
    }
  }

  return clamp(score);
}

function clamp(n: number, min = 0, max = 10): number {
  return Math.max(min, Math.min(max, n));
}
