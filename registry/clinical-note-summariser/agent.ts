import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'note-summariser',
  description: 'Produces SOAP-format summaries from clinician dictation.',
  systemPrompt: `You are SOAP Generator. Convert clinician dictation into a SOAP-format note: Subjective, Objective, Assessment, Plan.
Preserve clinical facts verbatim. Do not infer diagnoses the clinician did not state. Standardise units (mg, mL, bpm, mmHg).
Flag missing fields (no plan, no vitals) for the clinician to fill in rather than silently leaving them blank.
Output is always a draft for clinician sign-off — never finalised.`,
}

export interface NoteSummariserAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createNoteSummariserAgent(config: NoteSummariserAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
