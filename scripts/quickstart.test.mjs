import { afterEach, describe, expect, it } from 'vitest'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { mockAdapter } from '@agentskit/adapters'
import { createPrdAuthorAgent } from '../registry/coding-prd-author/agent.ts'

const fixtures = []

afterEach(() => {
  for (const fixture of fixtures.splice(0)) rmSync(fixture, { recursive: true, force: true })
})

describe('representative add and run quickstart', () => {
  it('copies the committed bundle into a clean fixture and runs the same source contract', async () => {
    const root = mkdtempSync(join(tmpdir(), 'agentskit-registry-quickstart-'))
    fixtures.push(root)
    const bundle = JSON.parse(readFileSync(new URL('../public/r/coding-prd-author.json', import.meta.url), 'utf8'))
    const target = join(root, 'agents', bundle.id)
    mkdirSync(target, { recursive: true })
    for (const source of bundle.sources) writeFileSync(join(target, source.path), source.content)

    expect(readFileSync(join(target, 'agent.ts'), 'utf8')).toBe(
      readFileSync(new URL('../registry/coding-prd-author/agent.ts', import.meta.url), 'utf8'),
    )
    expect(bundle.installable).toBe(true)

    const adapter = mockAdapter({
      response: () => [
        {
          type: 'tool_call',
          toolCall: {
            id: 'quickstart',
            name: 'submit_prd',
            args: JSON.stringify({
              problem: 'customers need a status page',
              users: ['customers'],
              criteria: ['page is public', 'incidents show status', 'updates include timestamps'],
              outOfScope: ['internal alerting'],
              openQuestions: ['Who publishes updates?'],
            }),
          },
        },
        { type: 'done' },
      ],
    })
    const result = await createPrdAuthorAgent({ adapter }).run('Draft a small status-page PRD')
    expect(result.requiresReview).toBe(true)
    expect(result.prd.criteria).toHaveLength(3)
  })

  it('keeps the documented command synchronized with the verified fixture', () => {
    const guide = readFileSync(new URL('../docs/getting-started.md', import.meta.url), 'utf8')
    expect(guide).toContain('npx agentskit add coding-prd-author --run "Draft a small status-page PRD" --provider demo')
  })
})
