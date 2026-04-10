export type ExperimentStatus = 'stable' | 'beta' | 'draft' | 'deprecated';

export type ExperimentCategory =
  | 'ui'
  | 'dataViz'
  | 'animation'
  | 'layout'
  | 'forms'
  | 'navigation'
  | 'feedback'
  | 'content';

export type ThemeName = 'minimalist' | 'bento' | 'glassmorphism' | 'cyberpunk';

export type AgentId = 'devops' | 'uiGenerator' | 'businessStrategist';
export type AgentStatus = 'active' | 'idle' | 'processing' | 'error';

export interface Experiment {
  slug: string;
  category: ExperimentCategory;
  title: string;
  description: string;
  status: ExperimentStatus;
  createdAt: string;
  updatedAt: string;
  author: string;
  bundleSizeKb: number;
  themeSupport: ThemeName[];
  tags: string[];
  pricingTier?: 'free' | 'pro' | 'enterprise';
}

export interface AgentStatusInfo {
  id: AgentId;
  status: AgentStatus;
  lastActivity?: string;
}

export interface ActivityEvent {
  id: string;
  type:
    | 'experimentCreated'
    | 'experimentUpdated'
    | 'noteCreated'
    | 'noteUpdated'
    | 'themeChanged'
    | 'agentCompleted'
    | 'showroomAdded';
  payload: Record<string, string>;
  timestamp: string;
}
