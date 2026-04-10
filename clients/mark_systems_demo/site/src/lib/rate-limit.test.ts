import { describe, it, expect, beforeEach } from 'vitest';
import { rateLimit, getClientIp } from './rate-limit';

describe('rateLimit', () => {
  const id = `test-${Math.random()}`;

  it('allows first request', () => {
    const result = rateLimit(`${id}-first`);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it('blocks after max requests', () => {
    const testId = `${id}-block`;
    rateLimit(testId);
    rateLimit(testId);
    rateLimit(testId);
    const result = rateLimit(testId);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('tracks remaining requests', () => {
    const testId = `${id}-track`;
    const first = rateLimit(testId);
    const second = rateLimit(testId);
    expect(first.remaining).toBe(2);
    expect(second.remaining).toBe(1);
  });
});

describe('getClientIp', () => {
  it('extracts IP from x-forwarded-for', () => {
    const headers = new Headers({ 'x-forwarded-for': '192.0.2.1, 198.51.100.1' });
    expect(getClientIp(headers)).toBe('192.0.2.1');
  });

  it('falls back to x-real-ip', () => {
    const headers = new Headers({ 'x-real-ip': '192.0.2.2' });
    expect(getClientIp(headers)).toBe('192.0.2.2');
  });

  it('returns unknown when no IP headers', () => {
    const headers = new Headers();
    expect(getClientIp(headers)).toBe('unknown');
  });
});
