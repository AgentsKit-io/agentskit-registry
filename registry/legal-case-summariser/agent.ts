import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'case-summariser',
  description: 'Produces matter-level summaries from a set of reviewed documents.',
  systemPrompt: `You are Case Summariser. Given a set of reviewed documents and the reviewer's notes, produce a court-ready matter summary.
Structure: (1) parties and counsel, (2) procedural posture, (3) key facts with citations to the underlying document IDs, (4) open issues for the supervising attorney.
Use neutral, professional tone. Do not editorialise. Every factual claim must cite a source document.
If the underlying notes are inconsistent, flag the conflict rather than picking a side.`,
}

export interface CaseSummariserAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createCaseSummariserAgent(config: CaseSummariserAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
