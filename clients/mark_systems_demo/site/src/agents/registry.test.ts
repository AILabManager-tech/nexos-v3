import { describe, it, expect } from 'vitest';
import {
  AGENT_REGISTRY,
  listAgents,
  getAgent,
  getAgentsByPhase,
  buildDefaultPipeline,
  PHASE_ORDER,
} from './registry';
import type { AgentId } from './types';

describe('Agent Registry', () => {
  it('contains exactly 8 agents', () => {
    expect(Object.keys(AGENT_REGISTRY)).toHaveLength(8);
  });

  it('lists agents in phase order', () => {
    const list = listAgents();
    expect(list).toHaveLength(8);
    for (let i = 1; i < list.length; i++) {
      const prev = list[i - 1]!;
      const curr = list[i]!;
      expect(PHASE_ORDER[curr.phase]).toBeGreaterThanOrEqual(PHASE_ORDER[prev.phase]!);
    }
  });

  it('each agent has a unique id matching the registry key', () => {
    for (const [key, agent] of Object.entries(AGENT_REGISTRY)) {
      expect(agent.id).toBe(key);
    }
  });

  it('each agent has valid capabilities', () => {
    for (const agent of listAgents()) {
      expect(agent.capabilities.length).toBeGreaterThan(0);
      expect(agent.name.length).toBeGreaterThan(0);
      expect(agent.description.length).toBeGreaterThan(10);
    }
  });

  it('build default pipeline has 8 steps starting with lab-director', () => {
    const pipeline = buildDefaultPipeline();
    expect(pipeline).toHaveLength(8);
    expect(pipeline[0]).toBe('lab-director');
    expect(pipeline[pipeline.length - 1]).toBe('deploy-sentinel');
  });

  it('getAgent returns correct definition', () => {
    const agent = getAgent('devops');
    expect(agent.id).toBe('devops');
    expect(agent.phase).toBe('init');
    expect(agent.icon).toBe('Wrench');
  });

  it('getAgentsByPhase filters correctly', () => {
    const meta = getAgentsByPhase('meta');
    expect(meta).toHaveLength(1);
    expect(meta[0]?.id).toBe('lab-director');
  });

  it('dependency graph has no cycles', () => {
    const visited = new Set<AgentId>();
    const visiting = new Set<AgentId>();

    function visit(id: AgentId): boolean {
      if (visiting.has(id)) return false; // Cycle detected
      if (visited.has(id)) return true;
      visiting.add(id);
      const agent = AGENT_REGISTRY[id];
      for (const req of agent.requires) {
        if (!visit(req)) return false;
      }
      visiting.delete(id);
      visited.add(id);
      return true;
    }

    for (const id of Object.keys(AGENT_REGISTRY) as AgentId[]) {
      expect(visit(id)).toBe(true);
    }
  });

  it('all required dependencies exist in registry', () => {
    for (const agent of listAgents()) {
      for (const req of agent.requires) {
        expect(AGENT_REGISTRY[req]).toBeDefined();
      }
    }
  });

  it('total max budget is within reasonable range', () => {
    const total = listAgents().reduce((sum, a) => sum + a.maxBudgetUsd, 0);
    expect(total).toBeGreaterThan(0);
    expect(total).toBeLessThan(10); // Sanity cap
  });
});
