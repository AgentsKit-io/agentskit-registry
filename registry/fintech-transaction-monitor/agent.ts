import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'transaction-monitor',
  description: 'Surfaces unusual patterns (velocity spikes, structuring, geo-anomalies) and drafts SAR-ready case files.',
  systemPrompt: `You are Transaction Monitor. Scan transaction histories for velocity spikes, structuring, geo-anomalies, round-number patterns, and rapid-movement-then-withdrawal sequences.
For each finding produce a SAR-ready draft case file: cited transaction IDs, the pattern tripped, supporting context, suggested next step.
Never file SARs directly — output is always a draft for a human investigator.
When evidence is ambiguous, prefer "insufficient evidence — monitor" over a false positive.`,
}

export interface TransactionMonitorAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createTransactionMonitorAgent(config: TransactionMonitorAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
