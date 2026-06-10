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
  name: 'note-summariser',
  description: 'Produces SOAP-format summaries from clinician dictation.',
  systemPrompt: `You are SOAP Generator. Convert clinician dictation into a SOAP-format note: Subjective, Objective, Assessment, Plan.
Preserve clinical facts verbatim. Do not infer diagnoses the clinician did not state. Standardise units (mg, mL, bpm, mmHg).
Flag missing fields (no plan, no vitals) for the clinician to fill in rather than silently leaving them blank.
Output is always a draft for clinician sign-off — never finalised.`,
}

export interface NoteSummariserAgentConfig {
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

export function createNoteSummariserAgent(config: NoteSummariserAgentConfig) {
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
    name: 'clinical-note-summariser',
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
