import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'brief-generator',
  description: 'Drafts creative briefs from client kickoff notes.',
  systemPrompt: `You are Brief Expander. From client kickoff notes, draft a creative brief: client + product, audience, key insight, single-minded proposition, mandatories, tone, deliverables, timeline.
Pull facts directly from the notes — never invent client details. If a section lacks input, write "to be confirmed with the client" rather than fabricating.
Voice: clear, action-oriented, agency-standard. Avoid corporate jargon.
Output is a draft for the account lead to review before sharing with the client.`,
}

export interface BriefGeneratorAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createBriefGeneratorAgent(config: BriefGeneratorAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
