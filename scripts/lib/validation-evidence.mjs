import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const MIN_SCORE = 95
const MIN_CONFIDENCE = 0.95

function strings(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : []
}

/** Return safe, public evidence only when the independent review clears the v1 gate. */
export function readValidationEvidence(root, agentId) {
  const evidenceRoot = join(root, '.agentskit', 'live-cycle', agentId)
  if (!existsSync(evidenceRoot)) return null

  const iterations = readdirSync(evidenceRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^iteration-\d+$/.test(entry.name))
    .map((entry) => ({ name: entry.name, number: Number(entry.name.slice('iteration-'.length)) }))
    .sort((a, b) => a.number - b.number)

  const latest = iterations.at(-1)
  if (!latest) return null

  const iterationRoot = join(evidenceRoot, latest.name)
  const verdictPath = join(iterationRoot, 'reviewer-verdict.json')
  if (!existsSync(verdictPath)) return null

  let verdict
  try {
    verdict = JSON.parse(readFileSync(verdictPath, 'utf8'))
  } catch {
    return null
  }

  return normalizeValidationVerdict(verdict, {
    iterations: iterations.length,
    cases: readdirSync(iterationRoot).filter((name) => /^case-\d+-run-\d+\.json$/.test(name)).length,
  })
}

export function normalizeValidationVerdict(verdict, run) {
  const criticalFailures = strings(verdict?.criticalFailures)
  const qualifies =
    verdict?.approved === true &&
    typeof verdict.score === 'number' &&
    verdict.score >= MIN_SCORE &&
    verdict.score <= 100 &&
    typeof verdict.confidence === 'number' &&
    verdict.confidence >= MIN_CONFIDENCE &&
    verdict.confidence <= 1 &&
    criticalFailures.length === 0 &&
    typeof verdict.reason === 'string' &&
    verdict.reason.trim().length > 0

  if (!qualifies) return null

  return {
    status: 'approved',
    method: 'codex-executor-independent-reviewer',
    score: verdict.score,
    confidence: verdict.confidence,
    iterations: run.iterations,
    cases: run.cases,
    summary: verdict.reason.trim(),
    strengths: strings(verdict.strengths),
    notes: strings(verdict.requiredAdjustments),
  }
}

export function readValidationManifest(root) {
  const path = join(root, 'validation', 'evidence.json')
  if (!existsSync(path)) return new Map()
  try {
    const manifest = JSON.parse(readFileSync(path, 'utf8'))
    if (manifest?.schemaVersion !== 1 || typeof manifest.agents !== 'object') return new Map()
    return new Map(Object.entries(manifest.agents))
  } catch {
    return new Map()
  }
}
