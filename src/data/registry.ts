import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// The site reads the *built* registry (public/r/*.json — committed, single source of
// truth for the JSON API the CLI fetches) so pages and the API never drift. README
// prose is read straight from registry/<id>/ so contributors edit one file.
const ROOT = process.cwd()
const R = join(ROOT, 'public', 'r')
const REG = join(ROOT, 'registry')

export type AgentSummary = {
  id: string
  title: string
  description: string
  category: string
  version?: string
  source?: string
  license?: string
  tags?: string[]
  packages?: string[]
  runnable: boolean
}

export type EnvVar = { name: string; description?: string; required?: boolean }
export type Source = { path: string; content: string }
export type Skill = { name: string; description: string; systemPrompt: string } | null

export type AgentBundle = AgentSummary & {
  env?: EnvVar[]
  files?: string[]
  skill: Skill
  a2a: unknown
  sources: Source[]
}

export function getIndex(): AgentSummary[] {
  const idx = JSON.parse(readFileSync(join(R, 'index.json'), 'utf8'))
  return (idx.agents as AgentSummary[]).slice().sort((a, b) => a.title.localeCompare(b.title))
}

export function getAgent(id: string): AgentBundle {
  return JSON.parse(readFileSync(join(R, `${id}.json`), 'utf8'))
}

export function getAgentIds(): string[] {
  return getIndex().map((a) => a.id)
}

/**
 * Opt-in localized prose: a contributor *may* add registry/<id>/README.<locale>.md;
 * otherwise every locale falls back to the English README. Never required.
 */
export function getReadme(id: string, locale = 'en'): string | null {
  const dir = join(REG, id)
  const candidates = locale === 'en' ? ['README.md'] : [`README.${locale}.md`, 'README.md']
  for (const c of candidates) {
    const p = join(dir, c)
    if (existsSync(p)) return readFileSync(p, 'utf8')
  }
  return null
}

export function installCommand(id: string): string {
  return `npx agentskit add ${id}`
}

export function bundleUrl(id: string): string {
  return `https://registry.agentskit.io/r/${id}.json`
}

export function getSource(bundle: AgentBundle, path: string): string | undefined {
  return bundle.sources.find((s) => s.path === path)?.content
}

/** A ready-to-paste instruction block for an AI agent / coding assistant. */
export function agentPrompt(a: AgentSummary): string {
  return [
    `Install the "${a.title}" agent from the AgentsKit registry and wire it into this project.`,
    ``,
    `1. Run: npx agentskit add ${a.id}`,
    `2. It copies the source into ./agents/${a.id}/ (you own the code — shadcn-style).`,
    `3. Import the factory from ./agents/${a.id}/agent and construct it with an adapter`,
    `   (e.g. openai({ apiKey: process.env.OPENAI_API_KEY })).`,
    ``,
    `What it does: ${a.description}`,
    `Full bundle (metadata + source) as JSON: ${bundleUrl(a.id)}`,
    `Docs: https://registry.agentskit.io/agents/${a.id}`,
  ].join('\n')
}
