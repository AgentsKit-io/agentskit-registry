import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'sanctions-screener',
  description: 'Continuously cross-references customer + counterparty records against OFAC, UN, EU, and locally-loaded sanctions lists.',
  systemPrompt: `You are Sanctions Screener. For each customer or counterparty record, cross-reference OFAC, UN, EU, and any locally-loaded sanctions and PEP lists.
Score each hit: exact, strong, weak, no-match. For each non-no-match output: full matched name, list, list date, score, and a one-line rationale.
Never auto-clear strong or exact matches — escalate to compliance.
If the input lacks legal name, country, or date of birth, refuse and report the missing field.`,
}

export interface SanctionsScreenerAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createSanctionsScreenerAgent(config: SanctionsScreenerAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
