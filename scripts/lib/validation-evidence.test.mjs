import { afterEach, describe, expect, it } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { readValidationEvidence, readValidationManifest } from './validation-evidence.mjs'

const roots = []

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true })
})

function fixture(verdict, cases = 3) {
  const root = mkdtempSync(join(tmpdir(), 'agentskit-validation-'))
  roots.push(root)
  const iteration = join(root, '.agentskit/live-cycle/example/iteration-1')
  mkdirSync(iteration, { recursive: true })
  writeFileSync(join(iteration, 'reviewer-verdict.json'), JSON.stringify(verdict))
  for (let index = 1; index <= cases; index++) writeFileSync(join(iteration, `case-${index}-run-1.json`), '{}')
  return root
}

describe('readValidationEvidence', () => {
  it('publishes a normalized summary for an independently approved agent', () => {
    const root = fixture({
      approved: true,
      score: 96,
      confidence: 0.96,
      reason: 'All cases passed safely.',
      criticalFailures: [],
      strengths: ['Typed output'],
      requiredAdjustments: ['Document one limitation'],
      validator: { stdout: 'private raw output' },
    })

    expect(readValidationEvidence(root, 'example')).toEqual({
      status: 'approved',
      method: 'codex-executor-independent-reviewer',
      score: 96,
      confidence: 0.96,
      iterations: 1,
      cases: 3,
      summary: 'All cases passed safely.',
      strengths: ['Typed output'],
      notes: ['Document one limitation'],
    })
  })

  it.each([
    { approved: false, score: 96, confidence: 0.96, reason: 'Rejected', criticalFailures: [] },
    { approved: true, score: 94, confidence: 0.96, reason: 'Below score', criticalFailures: [] },
    { approved: true, score: 96, confidence: 0.94, reason: 'Below confidence', criticalFailures: [] },
    { approved: true, score: 96, confidence: 0.96, reason: 'Critical', criticalFailures: ['unsafe'] },
  ])('fails closed when the review does not clear the gate', (verdict) => {
    expect(readValidationEvidence(fixture(verdict), 'example')).toBeNull()
  })

  it('returns null when evidence is missing', () => {
    const root = mkdtempSync(join(tmpdir(), 'agentskit-validation-'))
    roots.push(root)
    expect(readValidationEvidence(root, 'example')).toBeNull()
  })

  it('loads a versioned public manifest and fails closed on an unknown schema', () => {
    const root = mkdtempSync(join(tmpdir(), 'agentskit-validation-'))
    roots.push(root)
    mkdirSync(join(root, 'validation'))
    writeFileSync(join(root, 'validation/evidence.json'), JSON.stringify({ schemaVersion: 1, agents: { example: { status: 'approved' } } }))
    expect(readValidationManifest(root).get('example')).toEqual({ status: 'approved' })
    writeFileSync(join(root, 'validation/evidence.json'), JSON.stringify({ schemaVersion: 2, agents: {} }))
    expect(readValidationManifest(root).size).toBe(0)
  })
})
