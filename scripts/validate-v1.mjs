#!/usr/bin/env node
/**
 * Full v1 validation: vitest + @agentskit/eval replay cassettes.
 *
 * Usage:
 *   node scripts/validate-v1.mjs <id> | --ecosystem-doc-bridge | --coding | ...
 *   node scripts/validate-v1.mjs --live <id>     # semantic check with LLM
 *   node scripts/validate-v1.mjs --record <id>    # refresh cassette from live LLM
 */
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'
import { parsePackArgs, runEvalFor, recordCassette } from './lib/eval-runner.mjs'
import { hasLiveAdapterCredentials, liveAdapterHelp, resolveLiveAdapterConfig } from './lib/resolve-live-adapter.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const { ids, mode } = parsePackArgs(process.argv.slice(2))

if (!ids.length) {
  console.error('Usage: node scripts/validate-v1.mjs [--live|--record] <id> | --ecosystem-doc-bridge | --compliance | --coding')
  process.exit(1)
}

if ((mode === 'live' || mode === 'record') && !hasLiveAdapterCredentials()) {
  console.error(liveAdapterHelp())
  process.exit(1)
}

const liveCfg = resolveLiveAdapterConfig()
if (liveCfg && (mode === 'live' || mode === 'record')) {
  console.error(`eval adapter: ${liveCfg.provider} / ${liveCfg.model}`)
}

const evalMode = mode === 'seed' ? 'replay' : mode
let failed = 0

for (const id of ids) {
  console.log(`\n── ${id} (${evalMode}) ──`)
  try {
    execSync(`npx vitest run registry/${id}/agent.test.ts`, { cwd: root, stdio: 'pipe' })
    console.log('  ✓ vitest')
  } catch (e) {
    failed++
    console.log('  ✗ vitest')
    console.log(e.stdout?.toString() ?? e.message)
    continue
  }

  try {
    if (mode === 'record') {
      const { path, entries } = await recordCassette(root, id)
      console.log(`  ✓ recorded ${entries} entries → ${path.replace(root + '/', '')}`)
    }
    const result = await runEvalFor(root, id, evalMode)
    const ok = result.failed === 0
    console.log(`  ${ok ? '✓' : '✗'} eval ${result.passed}/${result.totalCases}`)
    if (!ok) {
      failed++
      for (const r of result.results.filter((x) => !x.passed)) {
        console.log(`    FAIL: ${String(r.input).slice(0, 70)}… → ${r.error ?? 'expected mismatch'}`)
      }
    }
  } catch (e) {
    failed++
    console.log(`  ✗ eval: ${e.message}`)
  }
}

console.log(failed ? `\n${failed} agent(s) failed validation` : `\nAll ${ids.length} agent(s) passed v1 validation (${evalMode})`)
process.exit(failed ? 1 : 0)