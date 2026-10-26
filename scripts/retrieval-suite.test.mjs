import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const suite = JSON.parse(readFileSync(resolve(root, 'docs/bench/retrieval-suite-v1.json'), 'utf8'))

describe('Doc Bridge retrieval suite', () => {
  it('keeps 20-40 uniquely identified cases', () => {
    expect(suite.cases.length).toBeGreaterThanOrEqual(20)
    expect(suite.cases.length).toBeLessThanOrEqual(40)
    expect(new Set(suite.cases.map((c) => c.id)).size).toBe(suite.cases.length)
  })

  it('only expects repository paths that exist', () => {
    const missing = []
    for (const c of suite.cases) {
      const targets = c.metadata?.expectedTargets ?? []
      expect(targets.length, c.id).toBeGreaterThan(0)
      for (const target of targets) {
        if (!existsSync(resolve(root, target))) missing.push(`${c.id}: ${target}`)
      }
    }
    expect(missing).toEqual([])
  })
})
