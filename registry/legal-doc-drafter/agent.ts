import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Doc Drafter — drafts a legal document (memo, motion, demand letter, client update)
 * from an approved fact pattern. Every factual claim cites its source record; any
 * inference is marked explicitly so the supervising attorney can verify it; the output
 * is ALWAYS a draft (never final, never a signature) and ends with the open questions
 * the attorney must resolve before sign-off.
 *
 * ```ts
 * const { document, inferences, openQuestions } = await createDocDrafterAgent({
 *   adapter, docType: 'demand-letter',
 * }).run(approvedFactPattern)
 * ```
 */

export type DocType = 'memo' | 'motion' | 'demand-letter' | 'client-update'

export interface Inference {
  /** The inferred statement (also flagged inline in the body). */
  text: string
  /** Why it was inferred / what it rests on. */
  basis: string
}

export interface DocDraftResult {
  docType: DocType
  /** The drafted document; inferences are flagged inline with "[inference]". */
  document: string
  /** Every inference, pulled out for attorney verification. */
  inferences: Inference[]
  /** Open questions the attorney must resolve before sign-off. */
  openQuestions: string[]
  /** Always true — a draft, never a final or a signature. */
  requiresAttorneyReview: boolean
}

export interface DocDrafterConfig {
  adapter: AdapterFactory
  docType?: DocType
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  document: z.string(),
  inferences: z.array(z.object({ text: z.string(), basis: z.string() })),
  openQuestions: z.array(z.string()),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const buildSkill = (docType: DocType) => ({
  name: 'doc-drafter',
  description: 'Drafts a legal document from approved facts; flags inferences; always a draft.',
  systemPrompt: `You draft a legal ${docType} from the approved fact pattern, in the firm's house style.

CITE every factual claim to the source record. Mark every inference inline with "[inference]" AND list
it in inferences (with its basis) so the supervising attorney can verify. The output is ALWAYS a DRAFT
— never a final, never a signature. List the open questions the attorney must resolve before sign-off.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_draft exactly once with { document, inferences, openQuestions }. Stop.`,
  tools: ['submit_draft'],
})

export function createDocDrafterAgent(config: DocDrafterConfig) {
  const docType = config.docType ?? 'memo'
  const skill = buildSkill(docType)
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_draft', description: 'Submit the document draft. Call exactly once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(facts: string): Promise<DocDraftResult> {
    if (!facts?.trim()) throw new Error('doc drafter requires an approved fact pattern')
    emit('draft', 'start', docType)
    const out = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `APPROVED FACT PATTERN (target: ${docType}):\n${fenceUntrustedContent(facts)}`,
      parse: (a) => Output.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    emit('draft', 'ok', `${out.inferences.length} inference(s), ${out.openQuestions.length} open question(s)`)
    return { docType, document: out.document, inferences: out.inferences, openQuestions: out.openQuestions, requiresAttorneyReview: true }
  }

  return {
    name: 'legal-doc-drafter',
    run,
    asHandle() {
      return { name: 'legal-doc-drafter', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
