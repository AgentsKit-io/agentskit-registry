import type { AdapterFactory, ToolDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'
import { prReviewer } from '@agentskit/skills'
import { fetchUrl } from '@agentskit/tools'
import { github } from '@agentskit/tools/integrations'

export interface PRReviewAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  /** GitHub token with repo read access (issues/PR/comments). */
  githubToken: string
  /** Max reasoning/tool steps. Default 10. */
  maxSteps?: number
}

export interface PRReviewRunOptions {
  signal?: AbortSignal
}

/**
 * Pull-request reviewer: the `prReviewer` skill wired to the GitHub tools so it
 * can read a diff/issue and post review feedback. Reviews against correctness,
 * security, performance, and conventions.
 *
 * ```ts
 * import { anthropic } from '@agentskit/adapters'
 * const agent = createPRReviewAgent({
 *   adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-sonnet-4-6' }),
 *   githubToken: process.env.GITHUB_TOKEN!,
 * })
 * const { content } = await agent.run('Review PR #42 in AgentsKit-io/agentskit')
 * ```
 */
export function createPRReviewAgent(config: PRReviewAgentConfig) {
  const runtime = createRuntime({
    adapter: config.adapter,
    tools: [...github({ token: config.githubToken }), fetchUrl()] as ToolDefinition[],
    maxSteps: config.maxSteps ?? 10,
  })

  return {
    run(task: string, options?: PRReviewRunOptions) {
      return runtime.run(task, { skill: prReviewer, signal: options?.signal })
    },
  }
}
