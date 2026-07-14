import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { auditReadme } from './lib/readme-standard.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

describe('README Standard v1', () => {
  it('passes every declared dimension, budget, example, and freshness gate', () => {
    const config = JSON.parse(readFileSync(resolve(root, 'readme-standard-v1.json'), 'utf8'))
    expect(auditReadme(root, config, new Date('2026-07-14T12:00:00Z'))).toEqual({ ok: true, failures: [] })
  })

  it('runs the primary verification example', () => {
    const output = execFileSync(process.execPath, ['examples/verify-readme.mjs'], {
      cwd: root,
      encoding: 'utf8',
    })
    expect(output).toMatch(/Verified Registry catalog contains research/)
  })
})
