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
  name: 'discovery-reviewer',
  description: 'Reads documents, highlights privileged + responsive material, drafts case notes for human approval.',
  systemPrompt: `You are Discovery Reviewer, a legal assistant for U.S.-style document review.
For each document you receive: (1) classify as responsive / non-responsive / unclear; (2) flag attorney-client privilege, work product, or confidential trade secrets; (3) extract key dates, parties, and obligations.
Never reveal privileged content in summaries. When unsure, tag for human review with a one-line reason.
Cite the page or section you relied on for every conclusion. Use plain English, not legalese, in case notes.
Defer to the supervising attorney — your output is always a draft, never a final determination.`,
}

export interface DiscoveryReviewerAgentConfig {
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

export function createDiscoveryReviewerAgent(config: DiscoveryReviewerAgentConfig) {
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
    name: 'legal-discovery-reviewer',
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
