/**
 * SOIC quality scoring — public API.
 */
export { evaluate, computeWeightedAverage } from './evaluate';
export { SOIC_DIMENSIONS } from './types';
export type {
  SoicDimension,
  SoicScores,
  SoicFinding,
  SoicReport,
} from './types';
