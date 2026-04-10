/**
 * Webhooks module — public API.
 */
export {
  registerTarget,
  listTargets,
  unregisterTarget,
  dispatch,
  sign,
} from './dispatcher';
export type {
  WebhookEventType,
  WebhookPayload,
  WebhookTarget,
  WebhookDeliveryResult,
} from './types';
