#!/usr/bin/env node
/**
 * Run eval.ts suite for one or more registry agents (uses agent.asHandle().run).
 * Usage: node scripts/run-eval.mjs <id> [id2...]
 *        node scripts/run-eval.mjs --alpha   # all alpha agents
 */
import { pathToFileURL } from 'node:url'
import { join, dirname } from 'node:path'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { mockAdapter } from '@agentskit/adapters'
import { runEval } from '@agentskit/eval'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

async function loadAgent(id) {
  const mod = await import(pathToFileURL(join(root, 'registry', id, 'agent.ts')).href)
  const factory = Object.keys(mod).find((k) => k.startsWith('create') && k.endsWith('Agent'))
  if (!factory) throw new Error(`${id}: no create*Agent export`)
  const agent = mod[factory]({ adapter: mockAdapter({ response: () => [{ type: 'done' }] }) })
  return async (input) => agent.asHandle().run(input)
}

async function runOne(id) {
  const evalMod = await import(pathToFileURL(join(root, 'registry', id, 'eval.ts')).href)
  if (!evalMod.suite?.cases?.length) throw new Error(`${id}: eval suite empty`)
  const agent = await loadAgent(id)
  const result = await runEval({ agent, suite: evalMod.suite })
  return { id, result }
}

const args = process.argv.slice(2)
let ids = args.filter((a) => !a.startsWith('--'))
if (args.includes('--alpha')) {
  const index = JSON.parse(readFileSync(join(root, 'public', 'r', 'index.json'), 'utf8'))
  ids = index.agents.filter((a) => a.status === 'alpha').map((a) => a.id)
}

if (!ids.length) {
  console.error('Usage: node scripts/run-eval.mjs <id> | --alpha')
  process.exit(1)
}

let failed = 0
for (const id of ids) {
  try {
    const { result } = await runOne(id)
    const ok = result.failed === 0
    console.log(`${ok ? '✓' : '✗'} ${id}: ${result.passed}/${result.totalCases} (${(result.accuracy * 100).toFixed(0)}%)`)
    if (!ok) {
      failed++
      for (const r of result.results.filter((x) => !x.passed)) {
        console.log(`    FAIL input=${String(r.input).slice(0, 60)}… err=${r.error ?? 'expected mismatch'}`)
      }
    }
  } catch (e) {
    failed++
    console.log(`✗ ${id}: ${e.message}`)
  }
}
process.exit(failed ? 1 : 0)