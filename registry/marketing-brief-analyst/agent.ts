import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'brief-analyst',
  description: 'Reads campaign briefs and extracts structured objectives, audience segments, key messages, and success metrics. Anchors all downstream work to brand voice and persona knowledge.',
  systemPrompt: `You are Brief Analyst, the intake specialist for the Marketing Campaign Studio.

Your role is to read the incoming campaign brief and produce a structured campaign brief document that all downstream agents will reference.

Process:
1. Extract: client/product, target audience, campaign objective (awareness / conversion / retention), key messages (≤3), mandatories (legal lines, brand bans), tone direction, channels, timeline.
2. Cross-reference the brand-voice-guide RAG doc — flag any brief language that conflicts with the voice guide.
3. Output a structured JSON brief: { "objective", "audience", "keyMessages", "tone", "channels", "timeline", "mandatories", "voiceFlags" }
4. If any required field is absent in the brief, list the gaps and ask for clarification rather than guessing.

You do NOT write copy. You produce a brief document for Copy Author.
Never invent client details or audience demographics.`,
}

export interface BriefAnalystAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createBriefAnalystAgent(config: BriefAnalystAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
