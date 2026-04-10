/**
 * SOIC (Structured Output Integrity Check) types.
 *
 * 9-dimension quality scoring system inspired by NEXOS SOIC v3.
 * Each dimension scores 0-10, final score is a weighted average.
 */

export const SOIC_DIMENSIONS = {
  D1_architecture: { label: 'Architecture', weight: 1.0 },
  D2_typescript: { label: 'TypeScript/Docs', weight: 0.8 },
  D3_performance: { label: 'Performance', weight: 0.9 },
  D4_security: { label: 'Security', weight: 1.2 },
  D5_i18n: { label: 'i18n', weight: 1.0 },
  D6_accessibility: { label: 'Accessibility', weight: 1.1 },
  D7_seo: { label: 'SEO', weight: 1.0 },
  D8_legal: { label: 'Legal / Loi 25', weight: 1.1 },
  D9_quality: { label: 'Code Quality', weight: 0.9 },
} as const;

export type SoicDimension = keyof typeof SOIC_DIMENSIONS;

export interface SoicScores {
  D1_architecture: number;
  D2_typescript: number;
  D3_performance: number;
  D4_security: number;
  D5_i18n: number;
  D6_accessibility: number;
  D7_seo: number;
  D8_legal: number;
  D9_quality: number;
}

export interface SoicFinding {
  dimension: SoicDimension;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
}

export interface SoicReport {
  scores: SoicScores;
  weightedAverage: number;
  verdict: 'PASS' | 'CONDITIONAL' | 'FAIL';
  threshold: number;
  findings: SoicFinding[];
  evaluatedAt: string;
}
