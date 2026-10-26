import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const suite = JSON.parse(readFileSync(resolve(root, 'docs/bench/retrieval-suite-v1.json'), 'utf8'))

describe('retrieval benchmark suite v1', () => {
  it('declares 20 to 40 deterministic cases in the Open Eval Format', () => {
    expect(suite.evalFormatVersion).toBe('2026-04')
    expect(suite.cases.length).toBeGreaterThanOrEqual(20)
    expect(suite.cases.length).toBeLessThanOrEqual(40)
    expect(new Set(suite.cases.map((c) => c.id)).size).toBe(suite.cases.length)
  })

  it('points every case at pages that exist in the repository', () => {
    for (const c of suite.cases) {
      const targets = c.metadata.expectedTargets
      expect(targets.length, c.id).toBeGreaterThan(0)
      for (const target of targets) expect(existsSync(resolve(root, target)), `${c.id} → ${target}`).toBe(true)
    }
  })

  it('keeps the portable regex consistent with the expected targets', () => {
    for (const c of suite.cases) {
      const pattern = new RegExp(c.expected.regex.body)
      for (const target of c.metadata.expectedTargets) expect(pattern.test(target), `${c.id} → ${target}`).toBe(true)
    }
  })
})
