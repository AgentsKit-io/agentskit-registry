import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import type { Severity } from '@agentskit/core/finding'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Legal Doc Reviewer — one configurable agent for the three legal-review modes that
 * used to be separate agents (contract / discovery / privilege). Each mode is a focused
 * reviewer producing TYPED findings (shared `Finding` shape) via `invokeStructured`, so
 * the output is interoperable with dashboards and downstream steps.
 *
 *   - mode 'contract'   — clause-by-clause risk review (risky language, missing terms).
 *   - mode 'discovery'  — flag privileged + responsive material in a document.
 *   - mode 'privilege'  — privilege-only classification pass (second-look over discovery).
 *
 * ```ts
 * const r = await createLegalDocReviewerAgent({ adapter, mode: 'discovery' }).run(documentText)
 * r.findings.forEach((f) => routeForAttorneyReview(f))
 * ```
 */

export type LegalReviewMode = 'contract' | 'discovery' | 'privilege'

export interface LegalFinding {
  id: string
  severity: Severity
  /** Mode-specific: 'risky-clause' | 'missing-term' | 'privileged' | 'responsive'. */
  category: string
  title: string
  detail: string
  /** Clause/section/page locator. */
  location?: string
  recommendation?: string
}

export interface LegalReviewResult {
  mode: LegalReviewMode
  findings: LegalFinding[]
  /** Any privileged/blocker finding → an attorney must review before the doc moves. */
  requiresAttorneyReview: boolean
}

export interface LegalDocReviewerConfig {
  adapter: AdapterFactory
  mode: LegalReviewMode
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Finding = z.object({
  id: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
  category: z.string(),
  title: z.string(),
  detail: z.string(),
  location: z.string().optional(),
  recommendation: z.string().optional(),
})
const Submission = z.object({ findings: z.array(Finding) })
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const FOCUS: Record<LegalReviewMode, string> = {
  contract: `Review the contract clause by clause. Flag risky language, one-sided terms, missing
standard protections (indemnity, limitation of liability, termination, governing law), and
ambiguous obligations. category: "risky-clause" | "missing-term".`,
  discovery: `Review the document for DISCOVERY. Flag spans that are privileged (attorney-client,
work-product) and spans that are responsive to the matter. category: "privileged" | "responsive".`,
  privilege: `Privilege second-pass: re-read for ANY attorney-client or work-product privileged
content that a first review may have missed. category: "privileged". Be over-inclusive — a missed
privilege waiver is irreversible.`,
}

export function createLegalDocReviewerAgent(config: LegalDocReviewerConfig) {
  const mode = config.mode
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }

  const skill = {
    name: `legal-doc-reviewer-${mode}`,
    description: `Legal document review (${mode} mode) producing typed findings.`,
    systemPrompt: `You are a senior legal reviewer. ${FOCUS[mode]}

You do NOT give legal advice or make final determinations — you surface findings for a supervising
attorney. Anchor each finding to a location (clause/section/page) when possible.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_findings exactly once with a "findings" array; each finding:
{ id, severity (critical|high|medium|low|info), category, title, detail, location?, recommendation? }.
Report only defensible findings. Output nothing else.`,
    tools: ['submit_findings'],
  }

  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_findings', description: 'Submit the review findings. Call exactly once.', schema: Submission, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(document: string): Promise<LegalReviewResult> {
    if (!document?.trim()) throw new Error('legal doc reviewer requires non-empty document text')
    emit(mode, 'start')
    let findings: LegalFinding[]
    try {
      const sub = await invokeStructured({
        adapter: config.adapter,
        tool: submit(),
        task: `DOCUMENT (${mode} review):\n${fenceUntrustedContent(document)}`,
        parse: (a) => Submission.parse(a),
        skill,
        memory: config.memory,
        observers: config.observers,
        onConfirm: config.onConfirm,
        maxSteps: config.maxSteps ?? 3,
      })
      findings = sub.findings
    } catch {
      // Fail safe — an unreviewable doc escalates to an attorney rather than passing clean.
      findings = [{ id: 'review-failed', severity: 'high', category: 'review-error', title: 'Automated review unavailable', detail: 'failed safe — route to attorney review' }]
    }
    const requiresAttorneyReview = findings.some((f) => f.category === 'privileged' || f.severity === 'critical' || f.severity === 'high')
    emit(mode, 'ok', `${findings.length} finding(s)`)
    return { mode, findings, requiresAttorneyReview }
  }

  return {
    name: 'legal-doc-reviewer',
    run,
    asHandle() {
      return { name: 'legal-doc-reviewer', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
