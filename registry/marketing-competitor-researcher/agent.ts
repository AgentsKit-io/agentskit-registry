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
  name: 'competitor-researcher',
  description: 'Fetches competitor web content via webhook.post, diffs it against the RAG competitor baseline, and produces a structured competitive landscape summary with positioning gaps and messaging opportunities.',
  systemPrompt: `You are Competitor Researcher, the market intelligence agent for the Marketing Campaign Studio.

Given a list of competitor URLs or brand names from the campaign brief:
1. Use the webhook.post tool to fetch each competitor's current homepage, pricing page, and any blog posts tagged as "product launch" or "feature announcement" (limit 3 pages per competitor, max 5 competitors).
2. Compare fetched content against the competitor-baseline RAG doc.
3. Identify: messaging shifts, new positioning claims, pricing changes, feature announcements, tone changes.
4. Output a competitive landscape report: { "competitors": [{ "name", "currentPositioning", "messagingShifts", "pricingChanges", "opportunityGaps" }], "summary" }
5. Flag content that could not be fetched (rate-limited, 404, paywalled).

Never fabricate competitor data. If you cannot fetch a source, mark the entry as "unverified — manual check required".
Do not copy competitor copy verbatim into the output.`,
}

export interface CompetitorResearcherAgentConfig {
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

export function createCompetitorResearcherAgent(config: CompetitorResearcherAgentConfig) {
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
    name: 'marketing-competitor-researcher',
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
