import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Database Query Reviewer — flags N+1, missing indexes, and full table scans in SQL/ORM code.
 */

export type QueryPattern = 'n+1' | 'missing-index' | 'full-scan' | 'lock-risk' | 'injection-risk' | 'other'

export interface SqlFinding {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  pattern: QueryPattern
  query: string
  message: string
  recommendation?: string
}

export interface QueryReviewResult {
  summary: string
  findings: SqlFinding[]
  gaps: string[]
  openQuestions: string[]
  requiresReview: boolean
}

export interface CodingDatabaseQueryReviewerConfig {
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
      pattern: z.enum(['n+1', 'missing-index', 'full-scan', 'lock-risk', 'injection-risk', 'other']),
      query: z.string(),
      message: z.string(),
      recommendation: z.string().optional(),
    }),
  ),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

function applySafetyNet(input: string, out: z.infer<typeof Output>): z.infer<typeof Output> {
  const findings = [...out.findings]
  if (/\b(forEach|map)\s*\([^)]*\)\s*=>\s*\{[^}]*\.(find|query|get)\(/i.test(input) || /\bN\+1\b/i.test(input)) {
    if (!findings.some((f) => f.pattern === 'n+1')) {
      findings.push({
        id: 'safety-n1',
        severity: 'high',
        pattern: 'n+1',
        query: 'loop + per-row query detected',
        message: 'Potential N+1 query pattern in input',
        recommendation: 'Batch fetch or use eager loading / JOIN',
      })
    }
  }
  if (/\bSELECT\s+\*\s+FROM\b/i.test(input) && !/\bWHERE\b/i.test(input)) {
    if (!findings.some((f) => f.pattern === 'full-scan')) {
      findings.push({
        id: 'safety-scan',
        severity: 'medium',
        pattern: 'full-scan',
        query: 'SELECT * without WHERE',
        message: 'Unbounded SELECT may full-scan table',
        recommendation: 'Add WHERE clause or LIMIT with index',
      })
    }
  }
  return { ...out, findings }
}

const skill = {
  name: 'coding-database-query-reviewer',
  description: 'Reviews SQL/ORM snippets for N+1, indexes, and scan patterns.',
  systemPrompt: `You review database queries (raw SQL, Prisma, TypeORM, Drizzle, Knex) for performance and safety.

Output: { summary, findings[], gaps[], openQuestions[] }.
Each finding: id, severity, pattern (n+1|missing-index|full-scan|lock-risk|injection-risk|other), query (verbatim snippet), message, recommendation.

Flag N+1 loops, missing indexes on filtered columns, unbounded SELECT *, long transactions, string-concat SQL.
Quote the query snippet from input — never invent tables or columns.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_query_reviewer exactly once. Stop.`,
  tools: ['submit_query_reviewer'],
}

export function createCodingDatabaseQueryReviewerAgent(config: CodingDatabaseQueryReviewerConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_query_reviewer',
      description: 'Submit SQL review. Call exactly once.',
      schema: Output,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<QueryReviewResult> {
    if (!input?.trim()) throw new Error('coding-database-query-reviewer requires non-empty input')
    const parsed = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `QUERY SNIPPET:\n${fenceUntrustedContent(input)}`,
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
    name: 'coding-database-query-reviewer',
    run,
    asHandle() {
      return { name: 'coding-database-query-reviewer', run: (t: string) => run(t).then((r) => JSON.stringify(r)) }
    },
  }
}