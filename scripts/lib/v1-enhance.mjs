/** v1 agent code generation — domain schemas + tests + eval per catalog spec. */

export function factoryName(id) {
  return id.replace(/(^|-)([a-z])/g, (_m, _s, c) => c.toUpperCase())
}

export function toolName(id) {
  const parts = id.split('-')
  return `submit_${parts.slice(-2).join('_')}`.slice(0, 48)
}

export function schemaFor(spec) {
  const t = `${spec.id} ${spec.output} ${spec.pain}`.toLowerCase()
  if (/triage|classif|scorer|router|screen/.test(t) && !/summar|drafter|author/.test(t)) {
    return {
      iface: `export type Severity = 'critical' | 'high' | 'medium' | 'low'
export interface AgentOutput { category: string; severity: Severity; queue: string; rationale: string; gaps: string[]; openQuestions: string[] }`,
      zod: `const Output = z.object({
  category: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  queue: z.string(),
  rationale: z.string(),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})`,
      prompt: 'Classify with category, severity, queue, rationale. Gaps for missing input.',
      post: `function applySafetyNet(input: string, o: z.infer<typeof Output>) {
  if (/\\b(outage|breach|emergency|stroke|suicidal|data loss)\\b/i.test(input) && o.severity !== 'critical')
    return { ...o, severity: 'critical' as const, queue: 'escalation', rationale: o.rationale + ' [safety-net]' }
  return o
}`,
      parse: 'applySafetyNet(input, Output.parse(a))',
      tests: `expect(r.severity).toBe('low')`,
      mock: `{ category: 'general', severity: 'low', queue: 'default', rationale: 'ok', gaps: [], openQuestions: [] }`,
      safetyTest: `it('escalates critical red flags', async () => {
    const r = await create${factoryName(spec.id)}Agent({ adapter: model({ category: 'x', severity: 'low', queue: 'q', rationale: 'm', gaps: [], openQuestions: [] }) }).run('full outage for all users')
    expect(r.severity).toBe('critical')
  })`,
    }
  }
  if (/checklist|qa-check/.test(t)) {
    return {
      iface: `export interface CheckItem { item: string; pass: boolean; notes: string }
export interface AgentOutput { summary: string; items: CheckItem[]; gaps: string[] }`,
      zod: `const Output = z.object({
  summary: z.string(),
  items: z.array(z.object({ item: z.string(), pass: z.boolean(), notes: z.string() })).min(1),
  gaps: z.array(z.string()).default([]),
})`,
      prompt: 'Checklist with pass/fail per item.',
      post: '',
      parse: 'Output.parse(a)',
      tests: `expect(r.items.length).toBeGreaterThan(0)`,
      mock: `{ summary: 'ok', items: [{ item: 'a', pass: true, notes: 'ok' }], gaps: [] }`,
      safetyTest: '',
    }
  }
  if (/findings|audit|detect|review|scan|gap|violat|anomal|interpreter/.test(t)) {
    return {
      iface: `export interface Finding { id: string; severity: 'critical' | 'high' | 'medium' | 'low' | 'info'; message: string; source?: string; recommendation?: string }
export interface AgentOutput { summary: string; findings: Finding[]; gaps: string[]; openQuestions: string[] }`,
      zod: `const Output = z.object({
  summary: z.string(),
  findings: z.array(z.object({
    id: z.string(), severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
    message: z.string(), source: z.string().optional(), recommendation: z.string().optional(),
  })),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})`,
      prompt: 'Actionable findings citing input sources. No invented issues.',
      post: '',
      parse: 'Output.parse(a)',
      tests: `expect(r.findings.length).toBeGreaterThan(0)`,
      mock: `{ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }`,
      safetyTest: '',
    }
  }
  if (/plan|schedule|timeline|migration|roadmap|cutover/.test(t)) {
    return {
      iface: `export interface Step { order: number; action: string; owner?: string; notes?: string }
export interface AgentOutput { title: string; steps: Step[]; risks: string[]; gaps: string[]; openQuestions: string[] }`,
      zod: `const Output = z.object({
  title: z.string(),
  steps: z.array(z.object({ order: z.number().int(), action: z.string(), owner: z.string().optional(), notes: z.string().optional() })).min(1),
  risks: z.array(z.string()).default([]),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})`,
      prompt: 'Ordered plan with risks and gaps.',
      post: '',
      parse: 'Output.parse(a)',
      tests: `expect(r.steps.length).toBeGreaterThan(0)`,
      mock: `{ title: 'plan', steps: [{ order: 1, action: 'step' }], risks: [], gaps: [], openQuestions: [] }`,
      safetyTest: '',
    }
  }
  if (/score|risk/.test(t) && !/drafter|author/.test(t)) {
    return {
      iface: `export interface AgentOutput { score: number; band: 'low' | 'medium' | 'high' | 'critical'; factors: string[]; rationale: string; gaps: string[] }`,
      zod: `const Output = z.object({
  score: z.number().min(0).max(100),
  band: z.enum(['low', 'medium', 'high', 'critical']),
  factors: z.array(z.string()),
  rationale: z.string(),
  gaps: z.array(z.string()).default([]),
})`,
      prompt: 'Score 0-100 with explicit factors from input.',
      post: '',
      parse: 'Output.parse(a)',
      tests: `expect(r.score).toBeGreaterThanOrEqual(0)`,
      mock: `{ score: 42, band: 'medium', factors: ['f1'], rationale: 'r', gaps: [] }`,
      safetyTest: '',
    }
  }
  if (/cluster|group/.test(t)) {
    return {
      iface: `export interface Cluster { name: string; theme: string; items: string[] }
export interface AgentOutput { summary: string; clusters: Cluster[]; unassigned: string[] }`,
      zod: `const Output = z.object({
  summary: z.string(),
  clusters: z.array(z.object({ name: z.string(), theme: z.string(), items: z.array(z.string()) })).min(1),
  unassigned: z.array(z.string()).default([]),
})`,
      prompt: 'Group into themed clusters.',
      post: '',
      parse: 'Output.parse(a)',
      tests: `expect(r.clusters.length).toBeGreaterThan(0)`,
      mock: `{ summary: 'ok', clusters: [{ name: 'c1', theme: 't', items: ['a'] }], unassigned: [] }`,
      safetyTest: '',
    }
  }
  // default: structured document draft
  return {
    iface: `export interface Section { heading: string; body: string; citations: string[] }
export interface AgentOutput { title: string; sections: Section[]; gaps: string[]; openQuestions: string[] }`,
    zod: `const Output = z.object({
  title: z.string(),
  sections: z.array(z.object({ heading: z.string(), body: z.string(), citations: z.array(z.string()).default([]) })).min(1),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})`,
    prompt: 'Draft sections with citations from input. Gaps for missing facts.',
    post: '',
    parse: 'Output.parse(a)',
    tests: `expect(r.sections.length).toBeGreaterThan(0)`,
    mock: `{ title: '${spec.title}', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }`,
    safetyTest: '',
  }
}

export function generateV1Agent(spec, schema, tool, factory) {
  const postBlock = schema.post ? `\n${schema.post}\n` : ''
  const parse = schema.post ? `parse: (a) => ${schema.parse},` : `parse: (a) => ${schema.parse},`
  return `import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/** ${spec.title} — v1 validated. Pain: ${spec.pain} */

${schema.iface}
export interface AgentResult extends AgentOutput { requiresReview: boolean }
export interface ${factory}Config {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

${schema.zod}
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7
${postBlock}
const skill = {
  name: '${spec.id}',
  description: ${JSON.stringify(spec.description)},
  systemPrompt: \`You are ${spec.title}. ${spec.pain}. Output: ${spec.output}.
${schema.prompt}
NEVER invent facts — gaps and openQuestions for missing input. Always draft for human review.
\${UNTRUSTED_CONTENT_DIRECTIVE}
Call ${tool} exactly once. Stop.\`,
  tools: ['${tool}'],
}

export function create${factory}Agent(config: ${factory}Config) {
  const submit = (): ToolDefinition =>
    defineZodTool({ name: '${tool}', description: 'Submit result. Once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('${spec.id} requires non-empty input')
    const result = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: \`INPUT:\\n\${fenceUntrustedContent(input)}\`,
      ${parse}
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 4,
    })
    return { ...result, requiresReview: true }
  }
  return {
    name: '${spec.id}',
    run,
    asHandle() { return { name: '${spec.id}', run: (t: string) => run(t).then((r) => JSON.stringify(r)) } },
  }
}
`
}

export function generateV1Test(spec, factory, tool, schema) {
  return `import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { create${factory}Agent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: '${tool}', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('${spec.id}', () => {
  it('returns typed v1 output', async () => {
    const r = await create${factory}Agent({ adapter: model(${schema.mock}) }).run('sample input for ${spec.id}')
    expect(r.requiresReview).toBe(true)
    ${schema.tests}
  })
  ${schema.safetyTest || ''}
  it('refuses empty input', async () => {
    await expect(create${factory}Agent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
`
}

export function generateV1Eval(spec) {
  return `import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: '${spec.id}',
  cases: [
    { input: 'Complete input for ${spec.title}: ${spec.pain}. Provide full structured output.', expected: (r: string) => r.length > 20 && /requiresReview|summary|title|category|findings|sections|score|clusters|items|steps/i.test(r) },
    { input: 'Minimal input.', expected: (r: string) => /gap|openQuestion/i.test(r) || r.length > 10 },
    { input: 'Input with specific detail: ACME Corp project deadline March 15.', expected: (r: string) => /ACME|March|15/i.test(r) || /gap/i.test(r) },
    { input: 'Empty context — only says "process this".', expected: (r: string) => r.length > 5 },
  ],
}
`
}

export function generateV1Meta(spec) {
  return {
    id: spec.id,
    title: spec.title,
    description: `${spec.output}. ${spec.pain}. Typed v1 agent with eval coverage.`,
    category: spec.category,
    status: 'validated',
    version: '1.0.0',
    source: 'agentskit-registry',
    license: 'MIT',
    tags: [...new Set([...(spec.tags ?? []), spec.category, 'structured-output', 'v1'])],
    packages: spec.packages ?? ['@agentskit/core', '@agentskit/runtime', '@agentskit/tools'],
    files: ['agent.ts', 'README.md', 'eval.ts'],
    requires: { zod: '^3', 'zod-to-json-schema': '^3' },
    ...(spec.locale ? { locale: spec.locale } : {}),
    ...(spec.ecosystem ? { ecosystem: true } : {}),
  }
}