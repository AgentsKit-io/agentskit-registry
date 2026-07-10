/**
 * Shared eval runner — @agentskit/eval + @agentskit/eval/replay.
 * Modes: replay (default CI), record (live + save), live (live only).
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { runEval } from '@agentskit/eval'
import { createLiveAdapter } from './resolve-live-adapter.mjs'
import {
  createRecordingAdapter,
  createReplayAdapter,
  loadCassette,
  saveCassette,
} from '@agentskit/eval/replay'
import { createSeedAdapter } from './cassette-seed.mjs'

export const PACKS = {
  'ecosystem-doc-bridge': [
    'ecosystem-doc-bridge-memory-classifier',
    'ecosystem-doc-bridge-handoff-author',
    'ecosystem-doc-bridge-corpus-scanner',
  ],
  ecosystem: [
    'ecosystem-changelog-ecosystem',
    'ecosystem-doc-bridge-corpus-scanner',
    'ecosystem-doc-bridge-handoff-author',
    'ecosystem-doc-bridge-memory-classifier',
    'ecosystem-integration-mapper',
    'ecosystem-llms-txt-optimizer',
    'ecosystem-playbook-alignment-auditor',
    'ecosystem-registry-agent-spec-author',
    'ecosystem-registry-eval-author',
    'ecosystem-rfc-author',
  ],
  compliance: [
    'compliance-lgpd-assessor',
    'compliance-breach-notification-br',
    'compliance-consent-record-auditor',
    'compliance-cross-border-transfer-memo',
    'compliance-cookie-policy-auditor',
    'compliance-data-retention-planner',
  ],
  coding: [
    'coding-accessibility-auditor',
    'coding-api-contract-reviewer',
    'coding-changelog-from-commits',
    'coding-code-qa',
    'coding-database-query-reviewer',
    'coding-dependency-auditor',
    'coding-dev-implementer',
    'coding-feature-flag-reviewer',
    'coding-i18n-reviewer',
    'coding-incident-postmortem',
    'coding-issue-creator',
    'coding-license-compliance',
    'coding-migration-planner',
    'coding-monorepo-impact',
    'coding-observability-gap',
    'coding-oncall-handoff',
    'coding-performance-interpreter',
    'coding-prd-author',
    'coding-qa-author',
    'coding-release-notes-drafter',
    'coding-runbook-from-incident',
    'coding-sbom-generator',
    'coding-security-scanner-interpreter',
    'coding-tech-debt-scorer',
    'coding-test-runner',
  ],
}

export function cassettePath(root, id) {
  return join(root, 'registry', id, 'eval.cassette.json')
}

function parseCommandsFromEvalInput(input) {
  const cmds = [...input.matchAll(/`([^`]+)`/g)]
    .map((m) => m[1])
    .filter((c) => /pnpm|npm|yarn|vitest|test|lint|typecheck/i.test(c))
  return [...new Set(cmds)]
}

const KYC_LISTS = [
  { name: 'Vladimir Putin', list: 'PEP' },
  { name: 'Jane Adverse', list: 'ADVERSE-MEDIA' },
]
const SANCTIONS_LIST = ['Vladimir Putin', 'Kim Jong Un', 'Alice Johnson', 'Jane Doe']

/** Agent-specific config beyond `adapter` (mirrors agent.test.ts fixtures). */
export function agentExtraConfig(id) {
  switch (id) {
    case 'fintech-kyc-screener':
      return { lists: KYC_LISTS }
    case 'fintech-sanctions-screener':
      return { sanctionsList: SANCTIONS_LIST }
    default:
      return {}
  }
}

export function codingCodeQaConfig(input, adapter) {
  const noCommands = /no test|commands were provided|package\.json scripts.*empty/i.test(input)
  const commands = noCommands ? [] : parseCommandsFromEvalInput(input)
  const defaultCommands = ['pnpm test', 'pnpm lint', 'pnpm typecheck']
  return {
    adapter,
    commands: commands.length ? commands : defaultCommands,
    run: (command) => {
      if (/all commands exited 0|zero failures/i.test(input)) {
        const dur = command.includes('test') ? 41000 : command.includes('lint') ? 6000 : 18000
        return { stdout: '', stderr: '', code: 0, durationMs: dur }
      }
      if (noCommands) return { stdout: '', stderr: '', code: 1, durationMs: 0 }
      const fail = /FAIL|error TS/.test(input) && !/all commands exited 0/i.test(input)
      if (fail) {
        const chunk =
          input.match(/FAIL[\s\S]*?(?:\n\n|$)/)?.[0] ??
          input.match(/error TS[\s\S]*?(?:\n\n|$)/)?.[0] ??
          'FAIL'
        return { stdout: chunk, stderr: '', code: 1, durationMs: 1200 }
      }
      return { stdout: 'ok', stderr: '', code: 0, durationMs: 500 }
    },
  }
}

export async function loadAgentModule(root, id) {
  const mod = await import(pathToFileURL(join(root, 'registry', id, 'agent.ts')).href)
  const factory = Object.keys(mod).find((k) => k.startsWith('create') && k.endsWith('Agent'))
  if (!factory) throw new Error(`${id}: no create*Agent export`)
  return { mod, factory }
}

export function buildAgentRunner(mod, factory, id, adapter) {
  if (id === 'coding-code-qa') {
    return async (input) => {
      const qa = mod[factory](codingCodeQaConfig(input, adapter))
      try {
        return await qa.asHandle().run(input)
      } catch (e) {
        return e instanceof Error ? e.message : String(e)
      }
    }
  }
  const agent = mod[factory]({ adapter, ...agentExtraConfig(id) })
  return async (input) => {
    try {
      return await agent.asHandle().run(input)
    } catch (e) {
      return e instanceof Error ? e.message : String(e)
    }
  }
}

/**
 * @returns {{ adapter: import('@agentskit/core').AdapterFactory, cassette?: import('@agentskit/eval/replay').Cassette, recording?: boolean }}
 */
export async function resolveAdapter(root, id, mode) {
  if (mode === 'live' || mode === 'record') {
    const base = createLiveAdapter()
    if (mode === 'record') {
      const { factory, cassette } = createRecordingAdapter(base, {
        metadata: { agent: id, source: 'live' },
      })
      return { adapter: factory, cassette, recording: true }
    }
    return { adapter: base, recording: false }
  }

  const path = cassettePath(root, id)
  if (!existsSync(path)) {
    throw new Error(`Missing eval cassette: registry/${id}/eval.cassette.json — run: npm run eval:seed -- ${id}`)
  }
  const cassette = await loadCassette(path)
  return {
    adapter: createReplayAdapter(cassette, { mode: 'sequential' }),
    recording: false,
  }
}

export async function loadEvalAgent(root, id, mode) {
  const { mod, factory } = await loadAgentModule(root, id)
  const { adapter } = await resolveAdapter(root, id, mode)
  return buildAgentRunner(mod, factory, id, adapter)
}

export async function runEvalFor(root, id, mode) {
  const evalMod = await import(pathToFileURL(join(root, 'registry', id, 'eval.ts')).href)
  if (!evalMod.suite?.cases?.length) throw new Error(`${id}: eval suite empty`)
  const agent = await loadEvalAgent(root, id, mode)
  return runEval({ agent, suite: evalMod.suite })
}

/** Seed cassette by recording seed-adapter responses (no API key). */
export async function seedCassette(root, id) {
  const { mod, factory } = await loadAgentModule(root, id)
  const evalMod = await import(pathToFileURL(join(root, 'registry', id, 'eval.ts')).href)
  if (!evalMod.suite?.cases?.length) throw new Error(`${id}: eval suite empty`)

  const base = createSeedAdapter(id, root)
  const { factory: recordFactory, cassette } = createRecordingAdapter(base, {
    metadata: { agent: id, source: 'seed-mock' },
  })
  const run = buildAgentRunner(mod, factory, id, recordFactory)

  for (const testCase of evalMod.suite.cases) {
    await run(testCase.input)
  }

  const path = cassettePath(root, id)
  await saveCassette(path, cassette)
  return { path, entries: cassette.entries.length }
}

/** Record cassette with live LLM (overwrites seed). */
export async function recordCassette(root, id) {
  const { mod, factory } = await loadAgentModule(root, id)
  const evalMod = await import(pathToFileURL(join(root, 'registry', id, 'eval.ts')).href)
  if (!evalMod.suite?.cases?.length) throw new Error(`${id}: eval suite empty`)

  const { adapter, cassette } = await resolveAdapter(root, id, 'record')
  const run = buildAgentRunner(mod, factory, id, adapter)

  for (const testCase of evalMod.suite.cases) {
    await run(testCase.input)
  }

  const path = cassettePath(root, id)
  await saveCassette(path, cassette)
  return { path, entries: cassette.entries.length }
}

export function parsePackArgs(argv) {
  const mode = argv.includes('--record')
    ? 'record'
    : argv.includes('--live')
      ? 'live'
      : argv.includes('--seed')
        ? 'seed'
        : 'replay'
  const packFlag = argv.find((a) => a.startsWith('--') && !['--live', '--record', '--seed', '--replay', '--ci'].includes(a))
  const pack = packFlag?.slice(2)
  const ids = argv.filter((a) => !a.startsWith('--'))
  if (pack && PACKS[pack]) return { ids: PACKS[pack], mode }
  return { ids, mode }
}