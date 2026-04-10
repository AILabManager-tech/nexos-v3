import { describe, it, expect } from 'vitest';
import {
  AgentIdSchema,
  AgentRequestSchema,
  AgentResponseSchema,
  OrchestrationPlanSchema,
} from './types';

describe('Zod schemas', () => {
  describe('AgentIdSchema', () => {
    it('accepts valid agent ids', () => {
      const valid = ['lab-director', 'devops', 'ui-generator', 'deploy-sentinel'];
      for (const id of valid) {
        expect(() => AgentIdSchema.parse(id)).not.toThrow();
      }
    });

    it('rejects invalid agent ids', () => {
      expect(() => AgentIdSchema.parse('unknown-agent')).toThrow();
      expect(() => AgentIdSchema.parse('')).toThrow();
    });
  });

  describe('AgentRequestSchema', () => {
    it('accepts minimal valid request', () => {
      const request = {
        agentId: 'devops',
        input: 'Create a component',
      };
      const parsed = AgentRequestSchema.parse(request);
      expect(parsed.agentId).toBe('devops');
      expect(parsed.options.temperature).toBe(0.7);
      expect(parsed.options.maxTokens).toBe(4096);
      expect(parsed.context.locale).toBe('fr');
    });

    it('accepts full valid request', () => {
      const request = {
        agentId: 'ui-generator',
        input: 'Build a card',
        context: {
          experimentSlug: 'animated-card',
          theme: 'cyberpunk' as const,
          locale: 'en' as const,
        },
        options: {
          stream: true,
          maxTokens: 8000,
          temperature: 0.5,
          budgetUsd: 0.75,
        },
      };
      const parsed = AgentRequestSchema.parse(request);
      expect(parsed.context.theme).toBe('cyberpunk');
      expect(parsed.options.stream).toBe(true);
    });

    it('rejects empty input', () => {
      expect(() =>
        AgentRequestSchema.parse({ agentId: 'devops', input: '' })
      ).toThrow();
    });

    it('rejects input too long', () => {
      expect(() =>
        AgentRequestSchema.parse({
          agentId: 'devops',
          input: 'x'.repeat(10001),
        })
      ).toThrow();
    });

    it('rejects invalid temperature', () => {
      expect(() =>
        AgentRequestSchema.parse({
          agentId: 'devops',
          input: 'test',
          options: { temperature: 3 },
        })
      ).toThrow();
    });

    it('rejects negative budget', () => {
      expect(() =>
        AgentRequestSchema.parse({
          agentId: 'devops',
          input: 'test',
          options: { budgetUsd: -1 },
        })
      ).toThrow();
    });
  });

  describe('AgentResponseSchema', () => {
    it('accepts valid response', () => {
      const response = {
        requestId: '123e4567-e89b-12d3-a456-426614174000',
        agentId: 'devops',
        status: 'success',
        output: 'Done',
        metadata: {
          model: 'claude-sonnet-4.6',
          provider: 'anthropic',
          tokensUsed: 500,
          costUsd: 0.003,
          durationMs: 1234,
        },
        createdAt: '2026-04-10T12:00:00Z',
      };
      expect(() => AgentResponseSchema.parse(response)).not.toThrow();
    });

    it('requires metadata', () => {
      expect(() =>
        AgentResponseSchema.parse({
          requestId: '123e4567-e89b-12d3-a456-426614174000',
          agentId: 'devops',
          status: 'success',
          output: 'Done',
          createdAt: '2026-04-10T12:00:00Z',
        })
      ).toThrow();
    });
  });

  describe('OrchestrationPlanSchema', () => {
    it('accepts a valid plan', () => {
      const plan = {
        id: '123',
        objective: 'Build a button',
        steps: [
          { order: 1, agentId: 'devops' as const, input: 'scaffold', dependsOn: [] },
          { order: 2, agentId: 'ui-generator' as const, input: 'generate', dependsOn: [1] },
        ],
        totalBudgetUsd: 0.5,
        createdAt: '2026-04-10T12:00:00Z',
      };
      expect(() => OrchestrationPlanSchema.parse(plan)).not.toThrow();
    });
  });
});
