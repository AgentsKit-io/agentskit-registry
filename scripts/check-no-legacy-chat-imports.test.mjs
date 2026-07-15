/**
 * Mechanical gate: Registry must keep the consolidated Chat 0.3 protocol
 * surface and never re-declare or import the 0.2 chat-protocol package.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
/** Built without a contiguous forbidden import literal in this file. */
const legacyImport = ['from ', "'", '@agentskit/', 'chat-protocol', "'"].join('')
const consolidatedImport = "from '@agentskit/chat/protocol'"

describe('no legacy AgentsKit Chat 0.2 packages', () => {
  it('pins exact @agentskit/chat@0.3.0 and omits the 0.2 protocol package', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
    const deps = {
      ...(pkg.dependencies ?? {}),
      ...(pkg.devDependencies ?? {}),
      ...(pkg.peerDependencies ?? {}),
    }
    expect(deps['@agentskit/chat']).toBe('0.3.0')
    expect(Object.keys(deps).some((name) => name.endsWith('chat-protocol'))).toBe(false)
    expect(Object.keys(deps).some((name) => name.endsWith('chat-react'))).toBe(false)
  })

  it('imports protocol from the consolidated subpath in discovery sources', () => {
    const discovery = readFileSync(join(root, 'scripts/lib/deterministic-discovery.mjs'), 'utf8')
    const tests = readFileSync(join(root, 'scripts/lib/deterministic-discovery.test.mjs'), 'utf8')
    expect(discovery).toContain(consolidatedImport)
    expect(discovery.includes(legacyImport)).toBe(false)
    expect(tests).toContain(consolidatedImport)
    expect(tests.includes(legacyImport)).toBe(false)
  })

  it('passes the repository legacy-import gate', () => {
    const output = execFileSync(process.execPath, [join(root, 'scripts/check-no-legacy-chat-imports.mjs')], {
      cwd: root,
      encoding: 'utf8',
    })
    expect(output).toContain('check-no-legacy-chat-imports: ok')
  })
})
