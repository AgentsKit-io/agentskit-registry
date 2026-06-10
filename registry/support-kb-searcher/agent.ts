import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'kb-searcher',
  description: 'Searches the knowledge base for the relevant article(s) given a ticket.',
  systemPrompt: `You are KB Searcher. Given a ticket, return the top three knowledge-base articles that answer it.
For each: title, URL, one-sentence quote of the section that matches, and a 1-5 confidence score.
Never invent an article. If no good match exists, say so and suggest the topic the article should cover.`,
}

export interface KbSearcherAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createKbSearcherAgent(config: KbSearcherAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
