import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Doc-bridge Handoff Author — drafts AgentHandoff v1 payloads from index context.
 * Never invents package ids or paths; gaps capture missing ownership signals.
 */

export const HANDOFF_SCHEMA_VERSION = 1 as const

const HandoffTarget = z.object({
  type: z.enum(['package', 'module', 'app', 'screen', 'flow', 'component', 'intent', 'change', 'search']),
  id: z.string().min(1),
  path: z.string().optional(),
  group: z.string().optional(),
  layer: z.string().optional(),
})

const HandoffBridge = z.object({
  humanDoc: z.enum(['linked', 'missing', 'external']),
  action: z.string().optional(),
  bootstrap: z.string().optional(),
})

const AgentHandoff = z.object({
  type: z.literal('agent-handoff'),
  schemaVersion: z.literal(HANDOFF_SCHEMA_VERSION).default(HANDOFF_SCHEMA_VERSION),
  source: z.string().min(1),
  target: HandoffTarget,
  startHere: z.string().min(1),
  readBeforeEditing: z.array(z.string()).max(64),
  editRoots: z.array(z.string()).max(32),
  checks: z.array(z.string()).max(32),
  humanDoc: z.string().nullable().optional(),
  bridge: HandoffBridge.optional(),
  playbookPatterns: z.array(z.string().url()).max(16).optional(),
  notes: z.array(z.string()).max(16),
})

export type AgentHandoffDraft = z.infer<typeof AgentHandoff>

export interface HandoffAuthorResult {
  handoff: AgentHandoffDraft | null
  gaps: string[]
  openQuestions: string[]
  requiresReview: boolean
}

export interface EcosystemDocBridgeHandoffAuthorConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  handoff: AgentHandoff.nullable(),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

function applySafetyNet(input: string, out: z.infer<typeof Output>): z.infer<typeof Output> {
  if (!out.handoff) return out
  const gaps = [...out.gaps]
  if (!/\b(package|module|id|path|editRoot)\b/i.test(input)) {
    gaps.push('ownership signals thin — verify target.id and editRoots against corpus')
  }
  if (out.handoff.humanDoc && !/\b(humanDoc|docusaurus|docs site|human adapter linked)\b/i.test(input)) {
    return { ...out, handoff: { ...out.handoff, humanDoc: null }, gaps: [...gaps, 'humanDoc not evidenced in input'] }
  }
  return { ...out, gaps: [...new Set(gaps)] }
}

const skill = {
  name: 'ecosystem-doc-bridge-handoff-author',
  description: 'Drafts doc-bridge AgentHandoff v1 records from index/corpus context.',
  systemPrompt: `You author doc-bridge AgentHandoff v1 JSON for routing agents between the index and human doc adapters.

Output shape: { handoff, gaps[], openQuestions[] }.
- handoff.type must be "agent-handoff", schemaVersion 1.
- target.type: package|module|app|screen|flow|component|intent|change|search — pick from input signals only.
- startHere: primary agent-doc path to read first.
- readBeforeEditing: ordered doc paths (include AGENTS.md when mentioned).
- editRoots: repo paths the editing agent may touch.
- checks: verification commands from input (npm test, lint, etc.) — never invent CI names.
- bridge.humanDoc: linked|missing|external based on whether a human adapter path exists in input.
- notes: short bullets citing input; no speculation.

If package id, paths, or ownership are missing → handoff=null and list gaps. NEVER invent package ids.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_handoff_author exactly once. Stop.`,
  tools: ['submit_handoff_author'],
}

export function createEcosystemDocBridgeHandoffAuthorAgent(config: EcosystemDocBridgeHandoffAuthorConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_handoff_author',
      description: 'Submit AgentHandoff v1 draft. Call exactly once.',
      schema: Output,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<HandoffAuthorResult> {
    if (!input?.trim()) throw new Error('ecosystem-doc-bridge-handoff-author requires non-empty input')
    const parsed = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `INDEX CONTEXT:\n${fenceUntrustedContent(input)}`,
      parse: (a) => applySafetyNet(input, Output.parse(a)),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 4,
    })
    return { ...parsed, requiresReview: true }
  }

  return {
    name: 'ecosystem-doc-bridge-handoff-author',
    run,
    asHandle() {
      return { name: 'ecosystem-doc-bridge-handoff-author', run: (t: string) => run(t).then((r) => JSON.stringify(r)) }
    },
  }
}