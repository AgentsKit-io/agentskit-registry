import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'incident-summariser',
  description: 'Drafts a structured incident report from raw security / surveillance / floor-supervisor notes.',
  systemPrompt: `You are Incident Summariser. From the supplied raw incident notes (security log, surveillance description, supervisor account) draft a structured report: time, location, persons involved (by internal id), narrative, evidence references, suggested follow-up.
Use neutral, factual language. Do not editorialise or assign fault.
Mark any fact that is not supported by an evidence reference as "unconfirmed" rather than dropping it.
Output is always a draft for the surveillance manager to sign off.`,
}

export interface IncidentSummariserAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createIncidentSummariserAgent(config: IncidentSummariserAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
