/** Archetype definitions for batch agent implementation. */

export const REGULATED = new Set(['clinical', 'legal', 'fintech', 'compliance', 'insurance', 'cybersecurity'])

export function factoryName(id) {
  return id.replace(/(^|-)([a-z])/g, (_m, _s, c) => c.toUpperCase())
}

export function toolName(id) {
  const tail = id.split('-').slice(-2).join('_')
  return `submit_${tail}`.slice(0, 48)
}

export function pickArchetype(spec) {
  const t = `${spec.id} ${spec.output} ${spec.pain}`.toLowerCase()
  if (/triage|classif|scorer|router|screen|evaluat/.test(t)) return 'CLASSIFICATION'
  if (/checklist|qa-check/.test(t)) return 'CHECKLIST'
  if (/cluster|group/.test(t)) return 'CLUSTER'
  if (/sequence|calendar|schedule|plan(?!ner)|migration|timeline|roadmap/.test(t)) return 'PLAN'
  if (/review|audit|detect|find|scan|interpreter|gap|violat|anomal/.test(t)) return 'FINDINGS'
  if (/drafter|author|generator|memo|letter|copy|brief|deck|script|notes|summary|summar/.test(t)) return 'DRAFT_DOC'
  if (/score|risk/.test(t)) return 'SCORE'
  return 'REPORT'
}

export function archetypeSchema(type) {
  switch (type) {
    case 'CLASSIFICATION':
      return {
        zod: `const Output = z.object({
  category: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  queue: z.string(),
  rationale: z.string(),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})`,
        iface: `export interface AgentOutput {
  category: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  queue: string
  rationale: string
  gaps: string[]
  openQuestions: string[]
}`,
        promptExtra: 'Classify with category, severity (critical|high|medium|low), and suggested queue. List gaps for missing input.',
        postProcess: `function applySafetyNet(input: string, o: z.infer<typeof Output>): z.infer<typeof Output> {
  const critical = /\\b(outage|down|breach|emergency|stroke|suicidal|data loss|security incident)\\b/i
  if (critical.test(input) && o.severity !== 'critical') {
    return { ...o, severity: 'critical', queue: 'escalation', rationale: o.rationale + ' [safety-net: forced critical]' }
  }
  return o
}`,
        usePost: true,
        parse: 'applySafetyNet(input, Output.parse(a))',
      }
    case 'FINDINGS':
      return {
        zod: `const Finding = z.object({
  id: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
  message: z.string(),
  source: z.string().optional(),
  recommendation: z.string().optional(),
})
const Output = z.object({
  summary: z.string(),
  findings: z.array(Finding),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})`,
        iface: `export interface Finding { id: string; severity: 'critical' | 'high' | 'medium' | 'low' | 'info'; message: string; source?: string; recommendation?: string }
export interface AgentOutput { summary: string; findings: Finding[]; gaps: string[]; openQuestions: string[] }`,
        promptExtra: 'Return actionable findings with severity. Cite sources from input. Never invent issues not supported by the input.',
        postProcess: '',
        usePost: false,
        parse: 'Output.parse(a)',
      }
    case 'CHECKLIST':
      return {
        zod: `const CheckItem = z.object({ item: z.string(), pass: z.boolean(), notes: z.string() })
const Output = z.object({
  summary: z.string(),
  items: z.array(CheckItem).min(1),
  gaps: z.array(z.string()).default([]),
})`,
        iface: `export interface CheckItem { item: string; pass: boolean; notes: string }
export interface AgentOutput { summary: string; items: CheckItem[]; gaps: string[] }`,
        promptExtra: 'Produce a checklist with pass/fail per item and notes.',
        postProcess: '',
        usePost: false,
        parse: 'Output.parse(a)',
      }
    case 'PLAN':
      return {
        zod: `const Step = z.object({ order: z.number().int(), action: z.string(), owner: z.string().optional(), notes: z.string().optional() })
const Output = z.object({
  title: z.string(),
  steps: z.array(Step).min(1),
  risks: z.array(z.string()).default([]),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})`,
        iface: `export interface Step { order: number; action: string; owner?: string; notes?: string }
export interface AgentOutput { title: string; steps: Step[]; risks: string[]; gaps: string[]; openQuestions: string[] }`,
        promptExtra: 'Produce an ordered plan with risks and gaps for missing info.',
        postProcess: '',
        usePost: false,
        parse: 'Output.parse(a)',
      }
    case 'CLUSTER':
      return {
        zod: `const Cluster = z.object({ name: z.string(), theme: z.string(), items: z.array(z.string()) })
const Output = z.object({
  summary: z.string(),
  clusters: z.array(Cluster).min(1),
  unassigned: z.array(z.string()).default([]),
})`,
        iface: `export interface Cluster { name: string; theme: string; items: string[] }
export interface AgentOutput { summary: string; clusters: Cluster[]; unassigned: string[] }`,
        promptExtra: 'Group items into named clusters with themes.',
        postProcess: '',
        usePost: false,
        parse: 'Output.parse(a)',
      }
    case 'SCORE':
      return {
        zod: `const Output = z.object({
  score: z.number().min(0).max(100),
  band: z.enum(['low', 'medium', 'high', 'critical']),
  factors: z.array(z.string()),
  rationale: z.string(),
  gaps: z.array(z.string()).default([]),
})`,
        iface: `export interface AgentOutput { score: number; band: 'low' | 'medium' | 'high' | 'critical'; factors: string[]; rationale: string; gaps: string[] }`,
        promptExtra: 'Score 0-100 with band and explicit factors from input only.',
        postProcess: '',
        usePost: false,
        parse: 'Output.parse(a)',
      }
    case 'DRAFT_DOC':
      return {
        zod: `const SectionSchema = z.object({ heading: z.string(), body: z.string(), citations: z.array(z.string()).default([]) })
const Output = z.object({
  title: z.string(),
  sections: z.array(SectionSchema).min(1),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})`,
        iface: `export interface Section { heading: string; body: string; citations: string[] }
export interface AgentOutput { title: string; sections: Section[]; gaps: string[]; openQuestions: string[] }`,
        promptExtra: 'Draft document sections. Cite sources inline in citations[]. Missing facts go to gaps, not invented prose.',
        postProcess: '',
        usePost: false,
        parse: 'Output.parse(a)',
      }
    default:
      return {
        zod: `const Output = z.object({
  summary: z.string(),
  insights: z.array(z.string()),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})`,
        iface: `export interface AgentOutput { summary: string; insights: string[]; gaps: string[]; openQuestions: string[] }`,
        promptExtra: 'Summarize with insights grounded in input.',
        postProcess: '',
        usePost: false,
        parse: 'Output.parse(a)',
      }
  }
}