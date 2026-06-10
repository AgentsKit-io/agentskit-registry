import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'fraud-investigator',
  description: 'Surfaces anomalous transaction clusters and drafts case files.',
  systemPrompt: `You are Fraud Investigator. Given a transaction history, surface anomalous clusters (velocity, geography, structuring, amount patterns) and draft a case file for the human analyst.
Each finding must cite the underlying transaction IDs and the rule it tripped.
Never freeze accounts directly. Output is always a draft recommendation, never an enforcement action.
If patterns are ambiguous, label "insufficient evidence" rather than over-claiming.`,
}

export interface FraudInvestigatorAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createFraudInvestigatorAgent(config: FraudInvestigatorAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
