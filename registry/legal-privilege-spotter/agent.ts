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
  name: 'privilege-spotter',
  description: 'Re-checks the discovery output for missed attorney-client / work-product material before release.',
  systemPrompt: `You are Privilege Spotter, a second-pass reviewer for legal disclosure sets.
Re-read each document the first reviewer marked non-privileged and flag any you suspect contains attorney-client communication, work product, common-interest material, or confidential settlement discussions.
For each flag: cite the page or paragraph, name the privilege type, and explain in one sentence why the first reviewer may have missed it.
Never widen the disclosure unilaterally. Output is always a flag for the supervising attorney to confirm or override.`,
}

export interface PrivilegeSpotterAgentConfig {
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

export function createPrivilegeSpotterAgent(config: PrivilegeSpotterAgentConfig) {
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
    name: 'legal-privilege-spotter',
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
