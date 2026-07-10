import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * LGPD Assessor — gap analysis against Lei 13.709/2018 signals in input.
 * Findings cite LGPD articles when evidenced; never invents processing activities.
 */

export interface LgpdFinding {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  article?: string
  message: string
  source?: string
  recommendation?: string
}

export interface LgpdAssessment {
  summary: string
  findings: LgpdFinding[]
  gaps: string[]
  openQuestions: string[]
  requiresReview: boolean
}

export interface ComplianceLgpdAssessorConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  summary: z.string(),
  findings: z.array(
    z.object({
      id: z.string(),
      severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
      article: z.string().optional(),
      message: z.string(),
      source: z.string().optional(),
      recommendation: z.string().optional(),
    }),
  ),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

function applySafetyNet(input: string, out: z.infer<typeof Output>): z.infer<typeof Output> {
  const findings = [...out.findings]
  if (/\b(breach|vazamento|incidente|data leak)\b/i.test(input)) {
    const hasBreachFinding = findings.some((f) => /breach|vazamento|incidente|art\.?\s*48/i.test(f.message))
    if (!hasBreachFinding) {
      findings.push({
        id: 'safety-breach',
        severity: 'critical',
        article: 'Art. 48',
        message: 'Potential security incident mentioned — confirm ANPD notification timeline',
        source: 'input signal',
        recommendation: 'Trigger incident response and document Art. 48 assessment',
      })
    }
  }
  if (/\b(menor|child|criança)\b/i.test(input) && !findings.some((f) => /Art\.?\s*14|child|menor/i.test(`${f.article} ${f.message}`))) {
    findings.push({
      id: 'safety-child',
      severity: 'high',
      article: 'Art. 14',
      message: 'Child data processing referenced — verify parental consent regime',
      source: 'input signal',
    })
  }
  return { ...out, findings }
}

const skill = {
  name: 'compliance-lgpd-assessor',
  description: 'LGPD gap assessment with article-tagged findings.',
  systemPrompt: `You assess LGPD (Lei 13.709/2018) compliance gaps from the provided processing description.

Output: { summary, findings[], gaps[], openQuestions[] }.
Each finding: id, severity, optional article (e.g. "Art. 7", "Art. 18"), message, source (quote/signal from input), recommendation.

Focus areas when evidenced in input:
- legal basis (Art. 7) — consent, legitimate interest, contract
- data subject rights (Art. 18)
- security measures (Art. 46)
- incident notification (Art. 48)
- DPO (Art. 41) — only if DPO mentioned or clearly required
- international transfer (Art. 33)

NEVER invent processing activities, vendors, or violations not supported by input.
Thin input → findings may be empty with gaps listing missing inventory fields.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_lgpd_assessor exactly once. Stop.`,
  tools: ['submit_lgpd_assessor'],
}

export function createComplianceLgpdAssessorAgent(config: ComplianceLgpdAssessorConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_lgpd_assessor',
      description: 'Submit LGPD assessment. Call exactly once.',
      schema: Output,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<LgpdAssessment> {
    if (!input?.trim()) throw new Error('compliance-lgpd-assessor requires non-empty input')
    const parsed = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `PROCESSING DESCRIPTION:\n${fenceUntrustedContent(input)}`,
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
    name: 'compliance-lgpd-assessor',
    run,
    asHandle() {
      return { name: 'compliance-lgpd-assessor', run: (t: string) => run(t).then((r) => JSON.stringify(r)) }
    },
  }
}