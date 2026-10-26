import { describe, expect, it } from 'vitest'
import { appendSourceSection, buildSourceSection, shippedFiles } from './agent-readme-source.mjs'

const meta = { files: ['agent.ts', 'README.md', 'eval.ts'] }

describe('agent README Source section', () => {
  it('lists the agent folder and every shipped file except README.md', () => {
    expect(shippedFiles(meta)).toEqual(['agent.ts', 'eval.ts'])
    expect(buildSourceSection(meta)).toContain(
      '[Agent folder](./) · [`agent.ts`](./agent.ts) · [`eval.ts`](./eval.ts)',
    )
  })

  it('appends the section once and leaves an existing section untouched', () => {
    const readme = '# Agent\n\n## Pain\nFacts\n'
    const once = appendSourceSection(readme, meta)
    expect(once.startsWith('# Agent\n\n## Pain\nFacts\n\n## Source\n')).toBe(true)
    expect(appendSourceSection(once, meta)).toBe(once)
  })
})
