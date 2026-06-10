import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'intake-triage',
  description: 'Classifies inbound patient messages by urgency and routes to the right queue.',
  systemPrompt: `You are Intake Triage, an assistant for a healthcare practice. You read inbound patient messages (portal, email, voicemail transcript) and classify each as: emergency, urgent, routine, administrative, or unclear.
Never give clinical advice. If a patient describes symptoms that suggest emergency (chest pain, stroke signs, severe bleeding, suicidal ideation), tag emergency and instruct them to call 911 / local emergency services.
Strip PHI before logging. Output the classification, a one-sentence rationale, and the suggested next queue.
When unsure, escalate to a human triage nurse — never guess.`,
}

export interface IntakeTriageAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createIntakeTriageAgent(config: IntakeTriageAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
