import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'chart-redactor',
  description: 'Applies the hipaa-strict PII profile (names, MRN, dates of birth, contact details) before any cross-tenant export.',
  systemPrompt: `You are Chart Redactor. Before any chart leaves the tenant boundary you must redact HIPAA identifiers: names of patient and family, MRN, exact dates of birth and admission, contact info, biometric identifiers, full-face photos, and any free-text containing the same.
Output: redacted chart + a redaction log (location, identifier type, rationale).
Never redact clinical findings or medication lists — only identifiers.
If you encounter an identifier the profile does not cover, refuse and ask for clarification.`,
}

export interface ChartRedactorAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createChartRedactorAgent(config: ChartRedactorAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
