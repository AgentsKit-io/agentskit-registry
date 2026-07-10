#!/usr/bin/env node
/**
 * Batch-implement catalog draft agents → alpha status.
 * Usage: node scripts/batch-implement.mjs [--category sales] [--limit 20] [--dry-run]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import {
  REGULATED,
  factoryName,
  toolName,
  pickArchetype,
  archetypeSchema,
} from './lib/agent-archetypes.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dryRun = process.argv.includes('--dry-run')
const catFilter = process.argv.find((a, i) => process.argv[i - 1] === '--category')
const limit = Number(process.argv.find((a, i) => process.argv[i - 1] === '--limit') ?? 0) || Infinity

const manifest = JSON.parse(readFileSync(join(root, 'catalog', 'manifest.json'), 'utf8'))
let validated = new Set()
try {
  const index = JSON.parse(readFileSync(join(root, 'public', 'r', 'index.json'), 'utf8'))
  validated = new Set(index.agents.filter((a) => a.status === 'validated').map((a) => a.id))
} catch { /* */ }

function generateAgent(spec, arch, tool, factory) {
  const parseLine = arch.usePost
    ? `parse: (a) => ${arch.parse},`
    : `parse: (a) => ${arch.parse},`

  return `import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * ${spec.title} — ${spec.output}
 * Pain: ${spec.pain}
 * Status: alpha (auto-implemented; requires human review before validated).
 */

${arch.iface}

export interface AgentResult extends AgentOutput {
  requiresReview: boolean
}

export interface ${factory}Config {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

${arch.zod}
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

${arch.postProcess || ''}

const skill = {
  name: '${spec.id}',
  description: ${JSON.stringify(spec.description)},
  systemPrompt: \`You are ${spec.title}. ${spec.pain}. Expected output: ${spec.output}.

${arch.promptExtra}
NEVER invent facts absent from the input — use gaps and openQuestions.
Output is always a draft for human review.

\${UNTRUSTED_CONTENT_DIRECTIVE}

Call ${tool} exactly once with the structured result. Stop.\`,
  tools: ['${tool}'],
}

export function create${factory}Agent(config: ${factory}Config) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: '${tool}',
      description: 'Submit the typed result. Call exactly once.',
      schema: Output,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('${spec.id} requires non-empty input')
    emit('run', 'start')
    const result = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: \`INPUT:\\n\${fenceUntrustedContent(input)}\`,
      ${parseLine}
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 4,
    })
    emit('run', 'ok')
    return { ...result, requiresReview: true }
  }

  return {
    name: '${spec.id}',
    run,
    asHandle() {
      return { name: '${spec.id}', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
`
}

function generateTest(spec, factory, tool, arch) {
  const mockPayload = mockForArchetype(arch)
  return `import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { create${factory}Agent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: '${tool}', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('${spec.id}', () => {
  it('returns typed output', async () => {
    const r = await create${factory}Agent({ adapter: model(${JSON.stringify(mockPayload)}) }).run('sample input for ${spec.id}')
    expect(r.requiresReview).toBe(true)
    ${assertionForArchetype(arch)}
  })

  it('refuses empty input', async () => {
    await expect(create${factory}Agent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
`
}

function mockForArchetype(arch) {
  if (arch.zod.includes('findings')) {
    return { summary: 'ok', findings: [{ id: '1', severity: 'low', message: 'test' }], gaps: [], openQuestions: [] }
  }
  if (arch.zod.includes('CheckItem')) {
    return { summary: 'ok', items: [{ item: 'a', pass: true, notes: 'ok' }], gaps: [] }
  }
  if (arch.zod.includes('steps')) {
    return { title: 'plan', steps: [{ order: 1, action: 'step' }], risks: [], gaps: [], openQuestions: [] }
  }
  if (arch.zod.includes('clusters')) {
    return { summary: 'ok', clusters: [{ name: 'c1', theme: 't', items: ['a'] }], unassigned: [] }
  }
  if (arch.zod.includes('score:')) {
    return { score: 50, band: 'medium', factors: ['f'], rationale: 'r', gaps: [] }
  }
  if (arch.zod.includes('sections')) {
    return { title: 'doc', sections: [{ heading: 'h', body: 'b', citations: [] }], gaps: [], openQuestions: [] }
  }
  if (arch.zod.includes('severity')) {
    return { category: 'general', severity: 'low', queue: 'default', rationale: 'ok', gaps: [], openQuestions: [] }
  }
  return { summary: 'ok', insights: ['i'], gaps: [], openQuestions: [] }
}

function assertionForArchetype(arch) {
  if (arch.zod.includes('findings')) return 'expect(r.findings.length).toBeGreaterThan(0)'
  if (arch.zod.includes('CheckItem')) return 'expect(r.items.length).toBeGreaterThan(0)'
  if (arch.zod.includes('steps')) return 'expect(r.steps.length).toBeGreaterThan(0)'
  if (arch.zod.includes('clusters')) return 'expect(r.clusters.length).toBeGreaterThan(0)'
  if (arch.zod.includes('score:')) return 'expect(r.score).toBe(50)'
  if (arch.zod.includes('sections')) return 'expect(r.sections.length).toBeGreaterThan(0)'
  if (arch.zod.includes('severity')) return "expect(r.severity).toBe('low')"
  return 'expect(r.summary).toBeTruthy()'
}

function generateEval(spec) {
  return `import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: '${spec.id}',
  cases: [
    {
      input: 'Sample input for ${spec.title}: ${spec.pain}. Provide structured output.',
      expected: (r: string) => r.length > 10,
    },
    {
      input: 'Minimal input — no details provided. List gaps instead of inventing.',
      expected: (r: string) => /gap|openQuestion|confirm|missing/i.test(r) || r.length > 5,
    },
  ],
}
`
}

function generateReadme(spec) {
  return `# ${spec.title}

> **Status: alpha** — installable via \`npx agentskit add ${spec.id}\` for experimentation. Not yet \`validated\`.

## Pain

${spec.pain}

## Output

${spec.output}

## Usage

\`\`\`ts
import { create${factoryName(spec.id)}Agent } from './agents/${spec.id}/agent'
const result = await create${factoryName(spec.id)}Agent({ adapter }).run(input)
\`\`\`

## Gates

${(spec.gates ?? []).map((g) => `- ${g}`).join('\n')}

## Promote to validated

Human review + expand \`eval.ts\` + set \`status: validated\` in meta.json.
`
}

let targets = manifest.agents.filter((a) => !validated.has(a.id))
if (catFilter) targets = targets.filter((a) => a.category === catFilter)
targets = targets.slice(0, limit)

console.log(`Implementing ${targets.length} agents → alpha${dryRun ? ' (dry-run)' : ''}...`)

let done = 0
for (const spec of targets) {
  const factory = factoryName(spec.id)
  const tool = toolName(spec.id)
  const archType = pickArchetype(spec)
  const arch = archetypeSchema(archType)
  const dir = join(root, 'registry', spec.id)
  if (!dryRun) mkdirSync(dir, { recursive: true })

  const files = {
    'agent.ts': generateAgent(spec, arch, tool, factory),
    'agent.test.ts': generateTest(spec, factory, tool, arch),
    'README.md': generateReadme(spec),
    'meta.json': JSON.stringify(
      {
        id: spec.id,
        title: spec.title,
        description: `${spec.output}. ${spec.pain}. Alpha: auto-implemented typed agent — review before production.`,
        category: spec.category,
        status: 'alpha',
        version: '0.1.0-alpha',
        source: 'agentskit-registry',
        license: 'MIT',
        tags: [...new Set([...(spec.tags ?? []), 'alpha', 'structured-output', spec.category])],
        packages: spec.packages ?? ['@agentskit/core', '@agentskit/runtime', '@agentskit/tools'],
        files: ['agent.ts', 'README.md', 'eval.ts'],
        requires: { zod: '^3', 'zod-to-json-schema': '^3' },
        ...(spec.locale ? { locale: spec.locale } : {}),
        ...(spec.ecosystem ? { ecosystem: true } : {}),
      },
      null,
      2,
    ) + '\n',
    'eval.ts': generateEval(spec),
  }

  if (!dryRun) {
    for (const [name, content] of Object.entries(files)) writeFileSync(join(dir, name), content)
  }
  done++
  if (done % 50 === 0) console.log(`  ${done}/${targets.length}...`)
}

console.log(`Generated ${done} agents.`)

if (!dryRun && done > 0) {
  console.log('Running validate + test + build...')
  try {
    execSync('npm run validate && npm test && npm run build', { cwd: root, stdio: 'inherit' })
    console.log('All checks passed.')
  } catch (e) {
    console.error('Checks failed — fix failing agents before promoting further.')
    process.exit(1)
  }
}