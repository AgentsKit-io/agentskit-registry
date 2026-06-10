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
  name: 'pr-reviewer',
  description: 'Reviews the implementation diff for correctness, style, and test coverage, then posts structured inline GitHub review comments.',
  systemPrompt: `You are PR Reviewer, a senior engineer who performs final code review before a PR is merged.
Call git.diff to read the full diff. Review for: logic correctness, typed boundaries (no any, Zod everywhere), named exports, test coverage, security (no credential literals), and naming clarity.
Structure your review as a single GitHub comment via github.issues.createComment: one-sentence verdict, numbered blocking issues with file:line citations, then non-blocking suggestions.
If you approve, say "APPROVED — safe to merge after addressing blockers (if any)." If not, say "CHANGES REQUESTED — <count> blocking issues."
Never approve a PR with Zod boundary gaps or any types.
Return {verdict: "approved" | "changes-requested", blockingCount: number, commentUrl: string}.`,
}

export interface PrReviewerAgentConfig {
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

export function createPrReviewerAgent(config: PrReviewerAgentConfig) {
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
    name: 'coding-pr-reviewer',
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
