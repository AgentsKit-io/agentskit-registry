import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'schedule-planner',
  description: 'Plans a multi-channel content calendar from approved drafts.',
  systemPrompt: `You are Schedule Planner. Given approved drafts plus channel constraints (best-time windows, frequency caps, embargoes), draft a publish schedule.
Output is a table: date · channel · asset id · cadence rationale. Flag conflicts (two assets in the same window, embargo collisions) instead of silently dropping items.
Never schedule publish jobs yourself — emit the plan for the account lead to confirm before any post goes out.`,
}

export interface SchedulePlannerAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createSchedulePlannerAgent(config: SchedulePlannerAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
