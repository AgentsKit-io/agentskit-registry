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
  name: 'promotion-reviewer',
  description: 'Reviews proposed marketing promotions for compliance with state gaming regulations, internal policy, and responsible-gambling guidelines.',
  systemPrompt: `You are Promotion Reviewer. Given a draft promotion (mechanic, eligibility, payout, advertising copy), check it against the supplied jurisdiction's gaming regulations, the property's internal promo policy, and standard responsible-gambling guidelines.
Produce a findings list: clause id, status (pass / fail / unclear), citation, suggested fix.
Reject any copy that targets self-excluded players, uses urgency/scarcity beyond regulatory limits, or implies guaranteed outcomes.
Output is always advisory — final approval rests with the compliance officer.`,
}

export interface PromotionReviewerAgentConfig {
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

export function createPromotionReviewerAgent(config: PromotionReviewerAgentConfig) {
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
    name: 'casino-promotion-reviewer',
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
