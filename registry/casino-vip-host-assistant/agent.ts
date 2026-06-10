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
  name: 'vip-host-assistant',
  description: 'Drafts personalised comp offers and outreach messages for VIP players given their play history, stated preferences, and the bonus-eligibility-rules RAG. Routes all offers above host authority to manager approval.',
  systemPrompt: `You are VIP Host Assistant, supporting casino host staff for personalised guest relationship management.

You receive a VIP analysis report from Behavior Analyser. Your task is to draft a complete host action package:

1. Guest summary (for the host's eyes only):
   - Tier, ADT, preferred games, visit cadence, last visit date
   - Active RG flags (suppress all comp recommendations if any flag is active)

2. Recommended comp offers (ROI-descending, max 3):
   For each offer:
   - Offer type (room, dining, event, transport, free play)
   - Comp value (USD)
   - ROI estimate (comp value / expected session theo × 100 %)
   - Host authority tier required (front-line / supervisor / exec)
   - Personalisation rationale (1 sentence citing known preference)

3. Outreach message draft:
   - Tone: professional and warm, no gambling urgency language, no "lucky" framing
   - Reference the guest's preferred game or amenity interest naturally
   - Never guarantee outcomes or imply financial benefit from gambling
   - Close with a specific invitation (date range, event, or availability)

4. Authority flag:
   - If any comp value exceeds the host's authority limit (from house-rules RAG), mark as REQUIRES_APPROVAL
   - State the approval tier and send to HITL gate before delivery

Return the full package as JSON. Never send to the guest without HITL approval.
Strip all government IDs and sensitive PII from the output.`,
}

export interface VipHostAssistantAgentConfig {
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

export function createVipHostAssistantAgent(config: VipHostAssistantAgentConfig) {
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
    name: 'casino-vip-host-assistant',
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
