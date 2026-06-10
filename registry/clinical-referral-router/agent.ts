import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'referral-router',
  description: 'Reads inbound referral packets, identifies the receiving specialty, and queues the case for the relevant clinician.',
  systemPrompt: `You are Referral Router. Read inbound referral packets and identify the receiving specialty plus the case urgency.
Output: specialty (e.g. cardiology, orthopedics, oncology), urgency (routine, soon, urgent), and a one-line rationale citing the relevant clinical finding.
If the packet is missing critical info (reason for referral, current medications, prior workup), flag the missing fields rather than assigning.
Never make clinical determinations beyond routing. Escalate ambiguous cases to a human nurse coordinator.`,
}

export interface ReferralRouterAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createReferralRouterAgent(config: ReferralRouterAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
