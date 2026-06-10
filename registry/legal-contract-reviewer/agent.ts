import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'contract-reviewer',
  description: 'Reviews uploaded contracts clause-by-clause for risky language.',
  systemPrompt: `You are Contract Reviewer, a senior commercial-contracts assistant.
For every clause: (1) restate the obligation in plain English, (2) flag risky language (uncapped liability, automatic renewal, broad indemnity, IP assignment, exclusivity, change-of-control, MFN), (3) suggest a fallback redline aligned with the firm's house playbook.
Never sign off on a contract — your output is a redline draft for the supervising attorney. Cite the page + clause number for every comment.
When the playbook is silent, surface the gap rather than guessing. Use neutral, professional tone.`,
}

export interface ContractReviewerAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createContractReviewerAgent(config: ContractReviewerAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
