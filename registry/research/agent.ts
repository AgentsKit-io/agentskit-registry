import type {
  AdapterFactory,
  ChatMemory,
  Observer,
  Retriever,
  ToolCall,
  ToolDefinition,
} from '@agentskit/core'
import { createRuntime, type DelegateConfig } from '@agentskit/runtime'
import { researcher } from '@agentskit/skills'
import { webSearch, fetchUrl } from '@agentskit/tools'

/** Overridable default tools — pass `tools` to replace them. */
const DEFAULT_TOOLS = [webSearch(), fetchUrl()]

export interface ResearchAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, ollama, …). */
  adapter: AdapterFactory
  /** Tools, integrations, or MCP tools — replaces the default [webSearch, fetchUrl]. */
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
  maxSteps?: number
}

/**
 * Citation-first research agent: the `researcher` skill wired to web search +
 * URL fetching by default. Every claim is anchored to a source URL.
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
    tools: config.tools ?? DEFAULT_TOOLS,
    memory: config.memory,
    retriever: config.retriever,
    delegates: config.delegates,
    onConfirm: config.onConfirm,
    observers: config.observers,
    maxSteps: config.maxSteps ?? 8,
  })

  return {
    /** Stable name for orchestration (supervisor / swarm / A2A). */
    name: 'research',
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill: researcher, signal: options?.signal })
    },
    /** AgentHandle for orchestration (supervisor / swarm / hierarchical / blackboard). */
    asHandle() {
      return {
        name: 'research',
        run: (task: string) => runtime.run(task, { skill: researcher }).then((r) => r.content),
      }
    },
  }
}
