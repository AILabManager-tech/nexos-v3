/**
 * Webhook dispatcher — sends outgoing HTTP notifications.
 *
 * Features:
 * - HMAC-SHA256 signing (headers: X-Webhook-Signature, X-Webhook-Timestamp)
 * - Timeout protection (5s max per delivery)
 * - Parallel fan-out to multiple targets
 * - Graceful failure (never throws)
 */
import { createHmac } from 'node:crypto';
import type {
  WebhookPayload,
  WebhookTarget,
  WebhookDeliveryResult,
  WebhookEventType,
} from './types';

const DELIVERY_TIMEOUT_MS = 5_000;

// In-memory registry for demo purposes. Replace with DB-backed storage
// when targets should be persisted per user.
const targets = new Map<string, WebhookTarget>();

export function registerTarget(target: Omit<WebhookTarget, 'id' | 'createdAt'>): WebhookTarget {
  const full: WebhookTarget = {
    ...target,
    id: `whk_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date(),
  };
  targets.set(full.id, full);
  return full;
}

export function listTargets(): WebhookTarget[] {
  return Array.from(targets.values());
}

export function unregisterTarget(id: string): boolean {
  return targets.delete(id);
}

/**
 * Sign a payload with HMAC-SHA256 using the target secret.
 */
export function sign(secret: string, body: string, timestamp: number): string {
  const hmac = createHmac('sha256', secret);
  hmac.update(`${timestamp}.${body}`);
  return `sha256=${hmac.digest('hex')}`;
}

/**
 * Dispatch a webhook event to all matching registered targets in parallel.
 */
export async function dispatch(
  event: WebhookEventType,
  payload: Omit<WebhookPayload, 'event' | 'timestamp'>
): Promise<WebhookDeliveryResult[]> {
  const fullPayload: WebhookPayload = {
    event,
    timestamp: new Date().toISOString(),
    ...payload,
  };
  const body = JSON.stringify(fullPayload);
  const timestamp = Date.now();

  const matching = listTargets().filter(
    (t) => t.active && t.events.includes(event)
  );

  return Promise.all(
    matching.map((target) => deliverOne(target, body, timestamp))
  );
}

async function deliverOne(
  target: WebhookTarget,
  body: string,
  timestamp: number
): Promise<WebhookDeliveryResult> {
  const start = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DELIVERY_TIMEOUT_MS);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Webhook-Timestamp': String(timestamp),
    'User-Agent': 'MarkSystems-Webhooks/1.0',
  };

  if (target.secret) {
    headers['X-Webhook-Signature'] = sign(target.secret, body, timestamp);
  }

  try {
    const response = await fetch(target.url, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal,
    });
    clearTimeout(timer);

    return {
      targetId: target.id,
      status: response.ok ? 'success' : 'failed',
      httpStatus: response.status,
      durationMs: Date.now() - start,
      ...(response.ok ? {} : { error: `HTTP ${response.status}` }),
    };
  } catch (error) {
    clearTimeout(timer);
    return {
      targetId: target.id,
      status: 'failed',
      durationMs: Date.now() - start,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
