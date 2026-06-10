import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'privilege-spotter',
  description: 'Re-checks the discovery output for missed attorney-client / work-product material before release.',
  systemPrompt: `You are Privilege Spotter, a second-pass reviewer for legal disclosure sets.
Re-read each document the first reviewer marked non-privileged and flag any you suspect contains attorney-client communication, work product, common-interest material, or confidential settlement discussions.
For each flag: cite the page or paragraph, name the privilege type, and explain in one sentence why the first reviewer may have missed it.
Never widen the disclosure unilaterally. Output is always a flag for the supervising attorney to confirm or override.`,
}

export interface PrivilegeSpotterAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createPrivilegeSpotterAgent(config: PrivilegeSpotterAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
