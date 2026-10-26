import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const script = join(dirname(fileURLToPath(import.meta.url)), 'scaffold-draft.mjs')
const DESCRIPTION = "Reads C:\\path\\to 'files' and ends with \\"
const TITLE = 'Back\\slash `Agent` ${x}'

let tmp
let registry
let env

function scaffold(...args) {
  return spawnSync(process.execPath, [script, 'bs-agent', ...args], { env, encoding: 'utf8' })
}

beforeEach(() => {
  tmp = mkdtempSync(join(tmpdir(), 'scaffold-draft-'))
  registry = join(tmp, 'registry')
  const manifest = join(tmp, 'manifest.json')
  writeFileSync(
    manifest,
    JSON.stringify({
      agents: [
        {
          id: 'bs-agent',
          title: TITLE,
          description: DESCRIPTION,
          pain: 'pain',
          output: 'output \\',
          category: 'ops',
        },
      ],
    }),
  )
  env = { ...process.env, SCAFFOLD_MANIFEST: manifest, SCAFFOLD_REGISTRY_DIR: registry }
})

afterEach(() => {
  rmSync(tmp, { recursive: true, force: true })
})

describe('scaffold-draft', () => {
  it('escapes backslashes so agent.ts string literals parse back to the input', () => {
    const r = scaffold()
    expect(r.status).toBe(0)
    const src = readFileSync(join(registry, 'bs-agent', 'agent.ts'), 'utf8')
    const line = src.split('\n').find((l) => l.trimStart().startsWith('description:'))
    const literal = line.trim().replace(/^description:\s*/, '').replace(/,$/, '')
    expect(new Function(`return ${literal}`)()).toBe(DESCRIPTION)
    expect(src).toContain('Back\\\\slash \\`Agent\\` \\${x}')
  })

  it('preserves an existing file without --force and overwrites it with --force', () => {
    const dir = join(registry, 'bs-agent')
    mkdirSync(dir, { recursive: true })
    const target = join(dir, 'README.md')
    writeFileSync(target, 'custom')

    const refused = scaffold()
    expect(refused.status).toBe(1)
    expect(refused.stderr).toContain('already exists')
    expect(readFileSync(target, 'utf8')).toBe('custom')

    const forced = scaffold('--force')
    expect(forced.status).toBe(0)
    expect(readFileSync(target, 'utf8')).toContain('# ')
    expect(readFileSync(target, 'utf8')).not.toBe('custom')
  })
})
