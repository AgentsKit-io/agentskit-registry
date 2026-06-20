import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { SEVERITY_ORDER, type Finding, type Severity } from '@agentskit/core/finding'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Transaction Investigator — scans a transaction history for anomalous patterns
 * (velocity, structuring, geo, round-number, rapid-movement-then-withdrawal) and drafts
 * a TYPED case file. Two modes: `fraud` (fraud case file) and `aml` (SAR-ready). Each
 * finding is a canonical `Finding` citing the underlying transaction IDs and the rule it
 * tripped — interoperable with dashboards, eval scorers, and AKOS workflow steps.
 *
 * Hard rules (replace the two prior single-prompt agents fraud-investigator /
 * transaction-monitor):
 *   - **Always a draft** — `requiresHumanReview` is always true; never freezes accounts
 *     or files SARs. Enforcement is a human decision.
 *   - **No over-claiming** — ambiguous evidence ⇒ `insufficientEvidence`, not a guess.
 *   - **Fail-safe** — if the model can't produce a structured case file, returns
 *     `insufficientEvidence:true` with no findings (never a silent all-clear).
 *
 * ```ts
 * const { findings, requiresHumanReview } = await createTransactionInvestigatorAgent({
 *   adapter, mode: 'aml',
 * }).run(transactionHistory)
 * ```
 */

export type InvestigationMode = 'fraud' | 'aml'

export interface InvestigationResult {
  mode: InvestigationMode
  findings: Finding[]
  summary: string
  /** Highest finding severity, or null when there are no findings. */
  highestSeverity: Severity | null
  /** True when evidence was too thin to draw conclusions. */
  insufficientEvidence: boolean
  /** Always true — a draft for the human investigator; never an enforcement action. */
  requiresHumanReview: boolean
}

export interface TransactionInvestigatorConfig {
  adapter: AdapterFactory
  /** 'fraud' = fraud case file, 'aml' = SAR-ready AML case file. Default 'fraud'. */
  mode?: InvestigationMode
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const FindingSchema = z.object({
  id: z.string(),
  severity: z.enum(SEVERITY_ORDER as unknown as [Severity, ...Severity[]]),
  title: z.string(),
  detail: z.string(),
  /** Pattern class: velocity | structuring | geo | round-number | rapid-movement. */
  category: z.string().optional(),
  /** Cited transaction IDs (comma-joined) — the evidence. */
  location: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  /** Suggested next step for the investigator. */
  remediation: z.string().optional(),
})
const Output = z.object({
  findings: z.array(FindingSchema),
  summary: z.string(),
  insufficientEvidence: z.boolean(),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const MODE_GUIDANCE: Record<InvestigationMode, string> = {
  fraud:
    'Draft a FRAUD case file for the human analyst. Focus: account-takeover signals, card-testing, ' +
    'unusual velocity/geography, amount patterns.',
  aml:
    'Draft a SAR-ready AML case file for the human investigator. Focus: structuring/smurfing, ' +
    'rapid movement-then-withdrawal, layering, round-number patterns, threshold avoidance.',
}

const buildSkill = (mode: InvestigationMode) => ({
  name: 'transaction-investigator',
  description: 'Surfaces anomalous transaction patterns as typed findings (draft for human review).',
  systemPrompt: `You investigate a transaction history for anomalous patterns. ${MODE_GUIDANCE[mode]}

Each finding MUST: cite the underlying transaction IDs (in location), name the pattern it tripped
(in category), set a severity (critical|high|medium|low|info), and suggest a next step (remediation).
NEVER freeze accounts or file reports — your output is always a DRAFT for a human.
If patterns are ambiguous or evidence is thin, set insufficientEvidence=true and prefer
"insufficient evidence — monitor" over a false positive. Do not over-claim.

${UNTRUSTED_CONTENT_DIRECTIVE}
Compliance: you do not provide financial advice; KYC/AML/sanctions decisions require human sign-off.

Call submit_case exactly once with { findings, summary, insufficientEvidence }. Stop.`,
  tools: ['submit_case'],
})

const rank = (s: Severity): number => SEVERITY_ORDER.indexOf(s)

export function createTransactionInvestigatorAgent(config: TransactionInvestigatorConfig) {
  const mode = config.mode ?? 'fraud'
  const skill = buildSkill(mode)
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_case', description: 'Submit the case file. Call exactly once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(history: string): Promise<InvestigationResult> {
    if (!history?.trim()) throw new Error('transaction investigator requires a non-empty transaction history')
    emit('investigate', 'start', mode)
    let out: z.infer<typeof Output>
    try {
      out = await invokeStructured({
        adapter: config.adapter,
        tool: submit(),
        task: `TRANSACTION HISTORY:\n${fenceUntrustedContent(history)}`,
        parse: (a) => Output.parse(a),
        skill,
        memory: config.memory,
        observers: config.observers,
        onConfirm: config.onConfirm,
        maxSteps: config.maxSteps ?? 3,
      })
    } catch {
      // FAIL-SAFE: never emit a silent all-clear when the model failed to produce a case file.
      emit('investigate', 'error')
      return { mode, findings: [], summary: 'investigation unavailable — manual review required', highestSeverity: null, insufficientEvidence: true, requiresHumanReview: true }
    }

    const findings = out.findings as Finding[]
    const highestSeverity = findings.length
      ? findings.reduce<Severity>((acc, f) => (rank(f.severity) < rank(acc) ? f.severity : acc), 'info')
      : null
    emit('investigate', 'ok', `${findings.length} finding(s)${highestSeverity ? ` (max ${highestSeverity})` : ''}`)
    return {
      mode,
      findings,
      summary: out.summary,
      highestSeverity,
      insufficientEvidence: out.insufficientEvidence,
      requiresHumanReview: true,
    }
  }

  return {
    name: 'fintech-transaction-investigator',
    run,
    asHandle() {
      return { name: 'fintech-transaction-investigator', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
