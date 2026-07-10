#!/usr/bin/env node
/**
 * Run eval.ts via @agentskit/eval + replay cassettes (default).
 *
 * Usage:
 *   node scripts/run-eval.mjs <id>              # replay cassette (CI)
 *   node scripts/run-eval.mjs --live <id>       # live LLM (any @agentskit/adapters provider)
 *   node scripts/run-eval.mjs --record <id>     # record live → eval.cassette.json
 *
 * Live/record env: AGENTSKIT_EVAL_PROVIDER, AGENTSKIT_EVAL_MODEL, <PROVIDER>_API_KEY
 * (auto-detects anthropic/openai/openrouter/… from available keys)
 *   node scripts/run-eval.mjs --ecosystem-doc-bridge
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { reportToCi } from '@agentskit/eval/ci'
import { parsePackArgs, runEvalFor } from './lib/eval-runner.mjs'
import { hasLiveAdapterCredentials, liveAdapterHelp, resolveLiveAdapterConfig } from './lib/resolve-live-adapter.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const args = process.argv.slice(2)
const ci = args.includes('--ci')
let { ids, mode } = parsePackArgs(args)

if (args.includes('--alpha')) {
  const index = JSON.parse(readFileSync(join(root, 'public', 'r', 'index.json'), 'utf8'))
  ids = index.agents.filter((a) => a.status === 'alpha').map((a) => a.id)
  mode = mode === 'seed' ? 'replay' : mode
}

if ((mode === 'live' || mode === 'record') && !hasLiveAdapterCredentials()) {
  console.error(liveAdapterHelp())
  process.exit(1)
}

const liveCfg = resolveLiveAdapterConfig()
if (liveCfg && (mode === 'live' || mode === 'record')) {
  console.error(`eval adapter: ${liveCfg.provider} / ${liveCfg.model}`)
}

if (!ids.length) {
  console.error('Usage: node scripts/run-eval.mjs [--live|--record|--ci] <id> | --ecosystem-doc-bridge | --alpha')
  process.exit(1)
}

const evalMode = mode === 'seed' ? 'replay' : mode
let failed = 0

for (const id of ids) {
  try {
    const result = await runEvalFor(root, id, evalMode)
    const ok = result.failed === 0
    console.log(`${ok ? '✓' : '✗'} ${id} [${evalMode}]: ${result.passed}/${result.totalCases} (${(result.accuracy * 100).toFixed(0)}%)`)
    if (ci) {
      const report = await reportToCi({ suiteName: id, result, prefix: id })
      if (!report.pass) failed++
    } else if (!ok) {
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