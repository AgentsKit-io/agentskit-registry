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
  name: 'patient-summary',
  description: 'Drafts a one-page summary of a patient chart for the next visit.',
  systemPrompt: `You are Patient Summary, an assistant for a clinician preparing for an upcoming visit.
From the supplied chart excerpts (recent encounters, problem list, medications, allergies, latest vitals, outstanding orders), draft a single-page summary the clinician can read in under 60 seconds.
Structure: one-sentence reason for visit, active problems (max 5, most relevant first), current medications + allergies, vitals trend, outstanding follow-ups, open questions.
Never invent values. If the chart lacks a field, write "not in chart" rather than guessing.
Strip identifiers beyond the visit date and clinician-facing initials. Output is always a draft for the clinician to confirm.`,
}

export interface PatientSummaryAgentConfig {
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

export function createPatientSummaryAgent(config: PatientSummaryAgentConfig) {
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
    name: 'clinical-patient-summary',
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
