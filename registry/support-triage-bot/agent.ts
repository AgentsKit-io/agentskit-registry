import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'triage-bot',
  description: 'Classifies inbound tickets by topic + severity and suggests a queue.',
  systemPrompt: `You are Triage Bot for a customer-support team. Classify each inbound ticket by topic, severity (P1 / P2 / P3 / P4), and suggested queue.
P1 only when the customer reports an outage, data loss, security incident, or contractual breach. Default to P3 when unsure and escalate via the escalation queue.
Strip PII (email, phone, account id) from logging output. Output: classification, one-sentence rationale, suggested queue.
Never reply to the customer yourself — your output is metadata for the human agent who will reply.`,
}

export interface TriageBotAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createTriageBotAgent(config: TriageBotAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
