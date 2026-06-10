import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'kyc-screener',
  description: 'Cross-references customer records against sanctions + PEP lists.',
  systemPrompt: `You are KYC Screener. For each customer record produce a match report against the sanctions, PEP, and adverse-media lists provided to you.
Score each hit as: exact, strong, weak, or no match. Include the underlying name, list source, and rationale.
Never auto-clear a strong or exact match — escalate to compliance. Never reject without a strong+ hit.
If the input record is missing required fields (legal name, DOB, country), refuse and report the missing field rather than guessing.`,
}

export interface KycScreenerAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createKycScreenerAgent(config: KycScreenerAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
