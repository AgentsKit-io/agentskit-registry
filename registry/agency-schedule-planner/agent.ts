import type {
  AdapterFactory,
  ChatMemory,
  Observer,
  Retriever,
  SkillDefinition,
  ToolCall,
  ToolDefinition,
} from '@agentskit/core'
import { createRuntime, type DelegateConfig } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'schedule-planner',
  description: 'Plans a multi-channel content calendar from approved drafts.',
  systemPrompt: `You are Schedule Planner. Given approved drafts plus channel constraints (best-time windows, frequency caps, embargoes), draft a publish schedule.
Output is a table: date · channel · asset id · cadence rationale. Flag conflicts (two assets in the same window, embargo collisions) instead of silently dropping items.
Never schedule publish jobs yourself — emit the plan for the account lead to confirm before any post goes out.`,
}

export interface SchedulePlannerAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, ollama, …). */
  adapter: AdapterFactory
  /** Tools, integrations, or MCP tools (toolsFromMcpClient). */
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

export function createSchedulePlannerAgent(config: SchedulePlannerAgentConfig) {
  const runtime = createRuntime({
    adapter: config.adapter,
    tools: config.tools ?? [],
    memory: config.memory,
    retriever: config.retriever,
    delegates: config.delegates,
    onConfirm: config.onConfirm,
    observers: config.observers,
    maxSteps: config.maxSteps ?? 6,
  })
  return {
    /** Stable name for orchestration (supervisor / swarm / A2A). */
    name: 'agency-schedule-planner',
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
