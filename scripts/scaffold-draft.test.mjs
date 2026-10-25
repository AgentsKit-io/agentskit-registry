/**
 * scaffold-draft.mjs: backslash-safe generated source and atomic, non-clobbering writes.
 * Runs a copy of the script inside a temp sandbox so the real registry/ is never touched.
 */
import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

const script = join(dirname(fileURLToPath(import.meta.url)), 'scaffold-draft.mjs')
const description = "Handles C:\\temp\\ and it's \\' tricky \\"
let sandbox

function scaffold(...args) {
  return spawnSync(process.execPath, [join(sandbox, 'scripts', 'scaffold-draft.mjs'), 'demo-agent', ...args], {
    encoding: 'utf8',
  })
}

beforeEach(() => {
  sandbox = mkdtempSync(join(tmpdir(), 'scaffold-draft-'))
  mkdirSync(join(sandbox, 'scripts'))
  mkdirSync(join(sandbox, 'catalog'))
  copyFileSync(script, join(sandbox, 'scripts', 'scaffold-draft.mjs'))
  writeFileSync(
    join(sandbox, 'catalog', 'manifest.json'),
    JSON.stringify({
      agents: [
        { id: 'demo-agent', title: 'Demo Agent', pain: 'p', output: 'o', description, category: 'ops' },
      ],
    }),
  )
})

afterEach(() => {
  rmSync(sandbox, { recursive: true, force: true })
})

describe('scaffold-draft', () => {
  it('escapes backslashes so the description literal evaluates back to the original', () => {
    const res = scaffold()
    expect(res.stderr).toBe('')
    expect(res.status).toBe(0)
    const src = readFileSync(join(sandbox, 'registry', 'demo-agent', 'agent.ts'), 'utf8')
    const literal = src.match(/^ {2}description: ('.*'),$/m)[1]
    expect(new Function(`return ${literal}`)()).toBe(description)
  })

  it('does not overwrite an existing target file without --force', () => {
    expect(scaffold().status).toBe(0)
    const readme = join(sandbox, 'registry', 'demo-agent', 'README.md')
    writeFileSync(readme, 'custom')
    const res = scaffold()
    expect(res.status).toBe(1)
    expect(readFileSync(readme, 'utf8')).toBe('custom')
  })

  it('overwrites existing files with --force', () => {
    expect(scaffold().status).toBe(0)
    const readme = join(sandbox, 'registry', 'demo-agent', 'README.md')
    writeFileSync(readme, 'custom')
    expect(scaffold('--force').status).toBe(0)
    expect(readFileSync(readme, 'utf8')).toContain('# Demo Agent')
  })
})
