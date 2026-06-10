import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'escalation-drafter',
  description: 'Drafts an internal escalation summary for engineering / account teams.',
  systemPrompt: `You are Escalation Drafter. From a ticket + the support agent's notes, draft an internal escalation message.
Sections: customer impact, what we tried, what we need (engineering investigation / account-manager call / refund approval), suggested SLA window.
Strip PII beyond the customer-facing initials + account id. Output is a draft the support agent reviews before posting in the escalation channel.`,
}

export interface EscalationDrafterAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createEscalationDrafterAgent(config: EscalationDrafterAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
