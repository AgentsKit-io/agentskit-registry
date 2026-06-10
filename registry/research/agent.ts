import type { AdapterFactory } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'
import { researcher } from '@agentskit/skills'
import { webSearch, fetchUrl } from '@agentskit/tools'

export interface ResearchAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, ollama, …). */
  adapter: AdapterFactory
  /** Max reasoning/tool steps before the agent must answer. Default 8. */
  maxSteps?: number
}

export interface ResearchRunOptions {
  signal?: AbortSignal
}

/**
 * Citation-first research agent: the `researcher` skill wired to web search +
 * URL fetching. Every claim is anchored to a source URL.
 *
 * ```ts
 * import { openai } from '@agentskit/adapters'
 * const agent = createResearchAgent({ adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }) })
 * const { content } = await agent.run('What changed in the EU AI Act in 2025?')
 * ```
 */
export function createResearchAgent(config: ResearchAgentConfig) {
  const runtime = createRuntime({
    adapter: config.adapter,
    tools: [webSearch(), fetchUrl()],
    maxSteps: config.maxSteps ?? 8,
  })

  return {
    run(task: string, options?: ResearchRunOptions) {
      return runtime.run(task, { skill: researcher, signal: options?.signal })
    },
  }
}
