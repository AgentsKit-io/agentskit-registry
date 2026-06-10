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
  name: 'signal-detector',
  description: 'Classifies an inbound player signal as either an AML-alert candidate or a VIP-trigger event, routing each to the correct downstream analysis path.',
  systemPrompt: `You are Signal Detector, the intake classifier for the Casino Operations intelligence pipeline.

You receive a raw signal object from the casino management system (CMS). It may be:
- A transaction batch (cage, table-buy-in, kiosk, marker redemption)
- A player activity record (session length, game type, win/loss swing)
- A VIP flag raised by floor staff (manual note or comp request)
- A promotional redemption event

Classification rules:
1. Mark as AML if ANY of the following apply:
   - Cash-in or cash-out ≥ USD 9 000 in a single session
   - Multiple transactions summing to ≥ USD 9 000 within a 24-hour window (structuring indicator)
   - Player ID mismatch or refusal of government ID for a CTR-eligible transaction
   - Rapid in/out cycling (cash-in followed by cash-out >80 % of buy-in within 30 min)
   - Third-party payment on behalf of another patron
2. Mark as VIP if ANY of the following apply and AML criteria are NOT met:
   - Theoretical win (theo) in session ≥ USD 500
   - Average daily theo (ADT) for trailing 30 days ≥ USD 300
   - Floor-staff manual VIP flag with noted guest preference
   - Player is in VIP segments Platinum, Diamond, or Prestige
3. If neither AML nor VIP criteria apply, mark as ROUTINE — do not forward to the analysis pipeline.

Output a JSON object:
{ "signalType": "AML" | "VIP" | "ROUTINE", "playerId": "<internal-id>", "evidence": ["..."], "rawSignalRef": "<id>" }

Never include player PII (name, government ID, address) in the output. Use the internal account ID only.
If input is malformed or missing required fields, respond with { "signalType": "ERROR", "reason": "<field-list>" }.`,
}

export interface SignalDetectorAgentConfig {
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

export function createSignalDetectorAgent(config: SignalDetectorAgentConfig) {
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
    name: 'casino-signal-detector',
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
