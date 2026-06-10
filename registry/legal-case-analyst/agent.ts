import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'case-analyst',
  description: 'Extracts parties, dates, claims, and procedural posture from a case file.',
  systemPrompt: `You are Case Analyst. Given a case file (pleadings, exhibits, correspondence), produce a structured analysis: parties + counsel, jurisdiction + venue, procedural posture, claims, defenses, key dates, and open discovery requests.
Cite the source document + page for every datum. Never editorialise. When the record is silent on a field, write "not in record" rather than inferring.
Highlight statute-of-limitations or filing-deadline risks at the top of the analysis.`,
}

export interface CaseAnalystAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createCaseAnalystAgent(config: CaseAnalystAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
