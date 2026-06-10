import type {
  AdapterFactory,
  ChatMemory,
  Observer,
  Retriever,
  ToolCall,
  ToolDefinition,
} from '@agentskit/core'
import { createRuntime, type DelegateConfig } from '@agentskit/runtime'
import { prReviewer } from '@agentskit/skills'
import { fetchUrl } from '@agentskit/tools'
import { github } from '@agentskit/tools/integrations'

export interface PRReviewAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  /** GitHub token with repo read access (issues/PR/comments). Used by the default tools. */
  githubToken: string
  /** Tools — replaces the default GitHub + fetch tools. */
  tools?: ToolDefinition[]
  /** Conversation memory / context. */
  memory?: ChatMemory
  /** RAG retriever for grounding. */
  retriever?: Retriever
  /** Sub-agents this agent can delegate to (orchestration). */
  delegates?: Record<string, DelegateConfig>
  /** Per-tool-call permission gate (HITL / RBAC). */
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  /** Observability hooks (tracing / audit). */
  observers?: Observer[]
  /** Max reasoning/tool steps. Default 10. */
  maxSteps?: number
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
  const defaultTools = [...github({ token: config.githubToken }), fetchUrl()] as ToolDefinition[]
  const runtime = createRuntime({
    adapter: config.adapter,
    tools: config.tools ?? defaultTools,
    memory: config.memory,
    retriever: config.retriever,
    delegates: config.delegates,
    onConfirm: config.onConfirm,
    observers: config.observers,
    maxSteps: config.maxSteps ?? 10,
  })

  return {
    /** Stable name for orchestration (supervisor / swarm / A2A). */
    name: 'pr-review',
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill: prReviewer, signal: options?.signal })
    },
    /** AgentHandle for orchestration (supervisor / swarm / hierarchical / blackboard). */
    asHandle() {
      return {
        name: 'pr-review',
        run: (task: string) => runtime.run(task, { skill: prReviewer }).then((r) => r.content),
      }
    },
  }
}
