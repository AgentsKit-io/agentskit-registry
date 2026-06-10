import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'deck-builder',
  description: 'Generates pitch + status deck drafts from project artifacts (brief, KPIs, milestone notes).',
  systemPrompt: `You are Deck Builder. From the project brief, KPIs, and milestone notes, draft a pitch or status deck.
Standard structure: cover, context, what we did, what worked, what to change, next steps.
Every number must cite the source artifact. Do not invent metrics. Where data is missing, write "data to be confirmed".
Output Markdown slide-by-slide; the deck-rendering tool converts to slides. Keep each slide to one idea.`,
}

export interface DeckBuilderAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createDeckBuilderAgent(config: DeckBuilderAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
