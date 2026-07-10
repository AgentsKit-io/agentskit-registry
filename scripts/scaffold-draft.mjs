#!/usr/bin/env node
/**
 * Scaffold a draft agent folder from catalog/manifest.json.
 * Usage: node scripts/scaffold-draft.mjs <id> [--force]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const id = process.argv[2]
const force = process.argv.includes('--force')
if (!id) {
  console.error('Usage: node scripts/scaffold-draft.mjs <id> [--force]')
  process.exit(1)
}

const manifest = JSON.parse(readFileSync(join(root, 'catalog', 'manifest.json'), 'utf8'))
const spec = manifest.agents.find((a) => a.id === id)
if (!spec) {
  console.error(`Unknown catalog id: ${id}`)
  process.exit(1)
}

const dir = join(root, 'registry', id)
if (existsSync(dir) && !force) {
  console.error(`${dir} already exists (use --force to overwrite scaffold files)`)
  process.exit(1)
}
mkdirSync(dir, { recursive: true })

const factory = id
  .split('-')
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join('')
  .replace(/^./, (c) => c.toUpperCase())

const agentTs = `import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * ${spec.title} — DRAFT scaffold.
 * Pain: ${spec.pain}
 * Output: ${spec.output}
 * Promote to validated after agent.test.ts + eval.ts pass and curator review.
 */

export const ${factory}OutputSchema = z.object({
  summary: z.string(),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
export type ${factory}Output = z.infer<typeof ${factory}OutputSchema>

export interface ${factory}AgentConfig {
  adapter: AdapterFactory
  tools?: ToolDefinition[]
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: '${id}',
  description: '${spec.description.replace(/'/g, "\\'")}',
  systemPrompt: \`You are ${spec.title}. ${spec.output}

Never invent facts absent from the input — list them in gaps or openQuestions.
Output is always a draft for human review.

\${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_result exactly once. Stop.\`,
  tools: ['submit_result'],
}

export function create${factory}Agent(config: ${factory}AgentConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_result',
      description: 'Submit the typed result. Call exactly once.',
      schema: ${factory}OutputSchema,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<${factory}Output> {
    if (!input?.trim()) throw new Error('${id} requires non-empty input')
    const result = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: input,
      parse: (a) => ${factory}OutputSchema.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 4,
    })
    return result
  }

  return {
    name: '${id}',
    run,
    asHandle() {
      return { name: '${id}', run: (task: string) => run(task).then((r) => JSON.stringify(r)) }
    },
  }
}
`

const testTs = `import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { create${factory}Agent } from './agent'

describe('${id}', () => {
  it('constructs and returns typed output (draft scaffold)', async () => {
    const adapter = mockAdapter({
      response: () => [
        {
          type: 'tool_call',
          toolCall: {
            id: '1',
            name: 'submit_result',
            args: JSON.stringify({ summary: 'draft ok', gaps: [], openQuestions: [] }),
          },
        },
        { type: 'done' },
      ],
    })
    const r = await create${factory}Agent({ adapter }).run('sample input')
    expect(r.summary).toBe('draft ok')
  })
})
`

const readme = `# ${spec.title}

> **Status: draft** — not installable via \`npx agentskit add\` until validated.

## Pain

${spec.pain}

## Output

${spec.output}

## Gates

${(spec.gates ?? []).map((g) => `- ${g}`).join('\n')}

## Promote to validated

1. Replace the placeholder Zod schema with the real output contract.
2. Add \`eval.ts\` with 5+ regression cases.
3. Run \`npm test && npm run build\`.
4. Set \`"status": "validated"\` in \`meta.json\` and open a PR.
`

const meta = {
  id,
  title: spec.title,
  description: spec.description,
  category: spec.category,
  status: 'draft',
  version: '0.0.0-draft',
  source: 'agentskit-registry',
  license: 'MIT',
  tags: spec.tags ?? [spec.category],
  packages: spec.packages ?? ['@agentskit/core', '@agentskit/runtime', '@agentskit/tools'],
  files: ['agent.ts', 'README.md'],
  requires: { zod: '^3', 'zod-to-json-schema': '^3' },
  ...(spec.locale ? { locale: spec.locale } : {}),
  ...(spec.ecosystem ? { ecosystem: true } : {}),
}

for (const [name, content] of [
  ['agent.ts', agentTs],
  ['agent.test.ts', testTs],
  ['README.md', readme],
  ['meta.json', JSON.stringify(meta, null, 2) + '\n'],
]) {
  const path = join(dir, name)
  if (existsSync(path) && !force) continue
  writeFileSync(path, content)
}

console.log(`scaffolded draft: registry/${id}/`)