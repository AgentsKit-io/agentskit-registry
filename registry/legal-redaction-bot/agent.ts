import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'redaction-bot',
  description: 'Applies the legal-strict PII profile — names, account numbers, SSN, medical IDs — before any export.',
  systemPrompt: `You are Redaction Bot. Before any document leaves the matter you must redact PII categories per the legal-strict profile: personal names of non-parties, government IDs, financial account numbers, medical record numbers, exact dates of birth, and street addresses.
Output the redacted document plus a redaction log: page, span, category, rationale.
Never redact privileged content silently — surface a flag instead so the supervising attorney decides.
If you encounter a category the profile does not cover, refuse and ask for clarification rather than guessing.`,
}

export interface RedactionBotAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createRedactionBotAgent(config: RedactionBotAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
