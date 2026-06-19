#!/usr/bin/env node
/**
 * Build the hosted registry index that `agentskit add <agent>` fetches.
 *
 * For each `registry/<id>/meta.json`, validates it, inlines the source of every
 * file it lists, and writes `public/r/<id>.json`. Also writes `public/r/index.json`
 * (the gallery + `agentskit list` source). These are served at
 * `https://registry.agentskit.io/r/*`.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const registryDir = join(root, 'registry')
const outDir = join(root, 'public', 'r')
const REQUIRED = ['id', 'title', 'description', 'category', 'packages', 'files']

mkdirSync(outDir, { recursive: true })

const ids = readdirSync(registryDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()

const index = []
const full = []

for (const id of ids) {
  const dir = join(registryDir, id)
  const metaPath = join(dir, 'meta.json')
  if (!existsSync(metaPath)) throw new Error(`${id}: missing meta.json`)
  const meta = JSON.parse(readFileSync(metaPath, 'utf8'))

  for (const key of REQUIRED) {
    if (meta[key] == null) throw new Error(`${id}: meta.json missing required field "${key}"`)
  }
  if (meta.id !== id) throw new Error(`${id}: meta.id "${meta.id}" must match folder name`)

  const files = meta.files.map((rel) => {
    const p = join(dir, rel)
    if (!existsSync(p)) throw new Error(`${id}: listed file "${rel}" does not exist`)
    return { path: rel, content: readFileSync(p, 'utf8') }
  })

  // Extract the inline skill's systemPrompt so the CLI/AKOS can run the agent as
  // data (no code execution). Scan EVERY copied source file (not just agent.ts) so
  // a single skill defined in a separate file (e.g. skills.ts) is still found.
  //
  // A single systemPrompt → that's the skill. ZERO (composes an external skill +
  // tools, e.g. research) or MULTIPLE (a multi-stage PIPELINE like code-review /
  // knowledge-promoter) → skill stays null: a pipeline is not one prompt and must
  // be consumed via flow decomposition, not run as a single skill.
  const prompts = files
    .filter((f) => f.path.endsWith('.ts'))
    .flatMap((f) => [...f.content.matchAll(/systemPrompt:\s*`((?:\\.|[^`\\])*)`/g)].map((mm) => mm[1]))
  const skill =
    prompts.length === 1
      ? {
          name: meta.id,
          description: meta.description,
          systemPrompt: prompts[0].replace(/\\`/g, '`').replace(/\\\$\{/g, '${'),
        }
      : null

  // A2A AgentCard — makes each agent discoverable/invocable by any A2A system.
  const a2a = {
    id: `io.agentskit.registry.${meta.id}`,
    name: meta.title,
    description: meta.description,
    version: meta.version ?? '1.0.0',
    homepage: `https://registry.agentskit.io`,
    skills: [
      {
        name: meta.id,
        description: meta.description,
        capabilities: { streaming: true, cancellation: true, requiresApproval: false },
      },
    ],
  }

  writeFileSync(
    join(outDir, `${id}.json`),
    JSON.stringify({ ...meta, skill, a2a, sources: files }, null, 2) + '\n',
  )
  const { files: _f, ...summary } = meta
  index.push({ ...summary, runnable: skill != null })
  full.push({
    id: meta.id,
    title: meta.title,
    description: meta.description,
    category: meta.category,
    packages: meta.packages,
    systemPrompt: skill?.systemPrompt ?? null,
  })
}

writeFileSync(join(outDir, 'index.json'), JSON.stringify({ schemaVersion: 1, agents: index }, null, 2) + '\n')

// Prune orphaned per-agent bundles (agent removed/renamed) so the published index
// never serves a `<id>.json` with no source under registry/ — the failure mode
// that let stray agent files linger after a rebase.
const valid = new Set([...ids.map((id) => `${id}.json`), 'index.json'])
for (const f of readdirSync(outDir)) {
  if (f.endsWith('.json') && !valid.has(f)) {
    rmSync(join(outDir, f))
    console.log(`pruned orphan bundle: public/r/${f}`)
  }
}

// ---------------------------------------------------------------------------
// Agent-discovery artifacts served from registry.agentskit.io (the browsable
// gallery + per-agent pages + JSON API all live on this site).
// Committed (like public/r/) so they ship without a separate build dependency.
// ---------------------------------------------------------------------------
const SITE = 'https://registry.agentskit.io'
const publicDir = join(root, 'public')

writeFileSync(
  join(publicDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
)

let ecoBlock = ''
try {
  const eco = JSON.parse(readFileSync(join(root, 'ecosystem.json'), 'utf8'))
  ecoBlock =
    '## The AgentsKit ecosystem\n\n' +
    eco.properties
      .filter((p) => p.id !== 'registry')
      .map((p) => `- [${p.name}](${p.url}) — ${p.tagline} llms.txt: ${p.llms}`)
      .join('\n') +
    '\n\n'
} catch {
  /* no ecosystem.json — skip */
}

const llmsHeader =
  `# AgentsKit Registry\n\n` +
  `> Ready-to-use AI agents for AgentsKit. Install with \`npx agentskit add <id>\` — ` +
  `you own the copied source. ${index.length} agents. Browse them at ` +
  `https://registry.agentskit.io.\n\n` +
  `- Machine index (JSON): ${SITE}/r/index.json\n` +
  `- Per-agent bundle (JSON): ${SITE}/r/<id>.json\n` +
  `- Per-agent page (HTML): ${SITE}/agents/<id>\n` +
  `- Per-agent markdown: ${SITE}/agents/<id>.md\n` +
  `- MCP endpoint: ${SITE}/api/mcp\n` +
  `- Full text: ${SITE}/llms-full.txt\n` +
  `- Sitemap: ${SITE}/sitemap.xml\n` +
  `- Built by AgentsKit: https://www.agentskit.io\n\n` +
  ecoBlock +
  `## Agents\n\n`
writeFileSync(
  join(publicDir, 'llms.txt'),
  llmsHeader +
    full
      .map(
        (a) =>
          `- [${a.title}](${SITE}/r/${a.id}.json) — ${a.description} ` +
          `Category: ${a.category}. Install: \`npx agentskit add ${a.id}\`.`,
      )
      .join('\n') +
    '\n',
)
writeFileSync(
  join(publicDir, 'llms-full.txt'),
  llmsHeader.replace('## Agents', '## Agents (full)') +
    full
      .map((a) =>
        [
          `### ${a.title} (\`${a.id}\`)`,
          `Category: ${a.category}`,
          `Packages: ${(a.packages ?? []).join(', ')}`,
          `Install: npx agentskit add ${a.id}`,
          '',
          a.description,
          a.systemPrompt ? `\nSystem prompt:\n\n${a.systemPrompt}` : '',
        ].join('\n'),
      )
      .join('\n\n---\n\n') +
    '\n',
)

console.log(`registry built: ${ids.length} agents → public/r/ + llms.txt, llms-full.txt, robots.txt`)
