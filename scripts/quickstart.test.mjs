import { afterEach, describe, expect, it } from 'vitest'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { mockAdapter } from '@agentskit/adapters'
import { createResearchAgent } from '../registry/research/agent.ts'

const fixtures = []

afterEach(() => {
  for (const fixture of fixtures.splice(0)) rmSync(fixture, { recursive: true, force: true })
})

describe('representative add and run quickstart', () => {
  it('copies the committed bundle into a clean fixture and runs the same source contract', async () => {
    const root = mkdtempSync(join(tmpdir(), 'agentskit-registry-quickstart-'))
    fixtures.push(root)
    const bundle = JSON.parse(readFileSync(new URL('../public/r/research.json', import.meta.url), 'utf8'))
    const target = join(root, 'agents', bundle.id)
    mkdirSync(target, { recursive: true })
    for (const source of bundle.sources) writeFileSync(join(target, source.path), source.content)

    expect(readFileSync(join(target, 'agent.ts'), 'utf8')).toBe(
      readFileSync(new URL('../registry/research/agent.ts', import.meta.url), 'utf8'),
    )
    expect(bundle.installable).toBe(true)

    const adapter = mockAdapter({
      response: () => [
        { type: 'text', content: 'The EU AI Act obligations are phased by risk category [1].' },
        { type: 'done' },
      ],
    })
    const result = await createResearchAgent({ adapter, tools: [] }).run(
      'What changed in the EU AI Act?',
    )
    expect(result.content).toContain('phased by risk category')
  })

  it('keeps the documented command synchronized with the verified fixture', () => {
    const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8')
    expect(readme).toContain('npx agentskit add research')
  })
})
