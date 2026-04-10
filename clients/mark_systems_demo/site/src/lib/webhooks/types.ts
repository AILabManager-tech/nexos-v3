/**
 * Webhook types — outgoing HTTP notifications for pipeline events.
 */

export type WebhookEventType =
  | 'pipeline.started'
  | 'pipeline.step.started'
  | 'pipeline.step.completed'
  | 'pipeline.completed'
  | 'pipeline.failed'
  | 'soic.evaluated';

export interface WebhookPayload {
  event: WebhookEventType;
  runId: string;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface WebhookTarget {
  id: string;
  url: string;
  events: WebhookEventType[];
  secret?: string; // HMAC signing secret
  active: boolean;
  createdAt: Date;
}

export interface WebhookDeliveryResult {
  targetId: string;
  status: 'success' | 'failed' | 'skipped';
  httpStatus?: number;
  durationMs: number;
  error?: string;
}
