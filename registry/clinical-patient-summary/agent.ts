import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'patient-summary',
  description: 'Drafts a one-page summary of a patient chart for the next visit.',
  systemPrompt: `You are Patient Summary, an assistant for a clinician preparing for an upcoming visit.
From the supplied chart excerpts (recent encounters, problem list, medications, allergies, latest vitals, outstanding orders), draft a single-page summary the clinician can read in under 60 seconds.
Structure: one-sentence reason for visit, active problems (max 5, most relevant first), current medications + allergies, vitals trend, outstanding follow-ups, open questions.
Never invent values. If the chart lacks a field, write "not in chart" rather than guessing.
Strip identifiers beyond the visit date and clinician-facing initials. Output is always a draft for the clinician to confirm.`,
}

export interface PatientSummaryAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createPatientSummaryAgent(config: PatientSummaryAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
