#!/usr/bin/env node
/**
 * Guard against regressing to AgentsKit Chat 0.2 package names.
 *
 * Registry deterministic discovery consumes the consolidated 0.3.x surface:
 *   @agentskit/chat/protocol
 * via the root package `@agentskit/chat` (exact stable pin).
 *
 * The standalone Registry must not reintroduce `@agentskit/chat-protocol` as a
 * dependency or import, and must not gain a chat UI/runtime dependency such as
 * `@agentskit/chat-react` / `@agentskit/chat/react`.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const thisScript = relative(root, fileURLToPath(import.meta.url)).split(sep).join('/')

const LEGACY = ['@agentskit/chat-protocol', '@agentskit/chat-react']
/** Chat UI / renderer surfaces — Registry stays discovery-only. */
const FORBIDDEN_CHAT_UI = [
  '@agentskit/chat/react',
  '@agentskit/chat-react',
  '@agentskit/chat/vue',
  '@agentskit/chat/solid',
  '@agentskit/chat/svelte',
  '@agentskit/chat/angular',
  '@agentskit/chat/ink',
  '@agentskit/chat/react-native',
]

const SKIP_DIR_NAMES = new Set([
  '.git',
  'node_modules',
  'coverage',
  'dist',
  'out',
  '.next',
  'public',
  'registry',
  'catalog',
  '.doc-bridge',
])

const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json'])

const usagePatterns = (pkg) => {
  const escaped = pkg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return [
    new RegExp(`from\\s+['"]${escaped}['"]`),
    new RegExp(`import\\s*\\(\\s*['"]${escaped}['"]\\s*\\)`),
    new RegExp(`require\\s*\\(\\s*['"]${escaped}['"]\\s*\\)`),
    new RegExp(`['"]${escaped}['"]\\s*:`),
  ]
}

function walk(directory, out = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (SKIP_DIR_NAMES.has(entry.name)) continue
    if (entry.name.startsWith('.') && entry.name !== '.github' && entry.isDirectory()) continue
    const full = join(directory, entry.name)
    if (entry.isDirectory()) {
      walk(full, out)
      continue
    }
    if (!entry.isFile()) continue
    const rel = relative(root, full).split(sep).join('/')
    if (rel === thisScript) continue
    if (rel === 'package-lock.json' || rel === 'pnpm-lock.yaml' || rel === 'package.json' || rel.endsWith('/package.json')) {
      out.push(full)
      continue
    }
    const dot = entry.name.lastIndexOf('.')
    if (dot >= 0 && CODE_EXTENSIONS.has(entry.name.slice(dot))) out.push(full)
  }
  return out
}

const hits = []
const forbidden = [...new Set([...LEGACY, ...FORBIDDEN_CHAT_UI])]

for (const file of walk(root)) {
  const text = readFileSync(file, 'utf8')
  const rel = relative(root, file).split(sep).join('/')
  const isLockfile = rel === 'package-lock.json' || rel === 'pnpm-lock.yaml'
  for (const name of forbidden) {
    const patterns = isLockfile
      ? [new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))]
      : usagePatterns(name)
    // Lockfile entries for optional nested deps of @agentskit/chat may mention
    // package names in resolved paths — flag only legacy package nodes and deps.
    if (isLockfile && name.startsWith('@agentskit/chat/') && !LEGACY.includes(name)) {
      // Subpath imports never appear as npm package names in lockfiles.
      continue
    }
    const lines = text.split(/\r?\n/)
    lines.forEach((line, index) => {
      if (!patterns.some((pattern) => pattern.test(line))) return
      // Ignore pure protocol subpath of the consolidated package in lockfile text.
      if (isLockfile && line.includes('@agentskit/chat@') && !LEGACY.some((legacy) => line.includes(legacy))) {
        return
      }
      hits.push({
        file: rel,
        line: index + 1,
        name,
        text: line.trim().slice(0, 200),
      })
    })
  }
}

if (hits.length > 0) {
  process.stderr.write(
    `Forbidden AgentsKit Chat package usage found (${hits.length}):\n` +
      'Registry may only depend on @agentskit/chat (exact) and import @agentskit/chat/protocol.\n' +
      'Do not use chat-protocol, chat-react, or other chat UI/runtime subpaths.\n\n',
  )
  for (const hit of hits) {
    process.stderr.write(`${hit.file}:${hit.line}: ${hit.name}\n  ${hit.text}\n`)
  }
  process.exit(1)
}

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const allDeps = {
  ...(pkg.dependencies ?? {}),
  ...(pkg.devDependencies ?? {}),
  ...(pkg.peerDependencies ?? {}),
  ...(pkg.optionalDependencies ?? {}),
}

for (const legacy of LEGACY) {
  if (legacy in allDeps) {
    process.stderr.write(`package.json still declares ${legacy}\n`)
    process.exit(1)
  }
}

if (!('@agentskit/chat' in allDeps)) {
  process.stderr.write('package.json must declare @agentskit/chat for @agentskit/chat/protocol imports.\n')
  process.exit(1)
}

const chatVersion = allDeps['@agentskit/chat']
if (chatVersion !== '0.3.0') {
  process.stderr.write(
    `package.json must pin @agentskit/chat to exact stable 0.3.0 (found ${JSON.stringify(chatVersion)}).\n`,
  )
  process.exit(1)
}

process.stdout.write(
  'check-no-legacy-chat-imports: ok (@agentskit/chat@0.3.0 /protocol only; no legacy packages)\n',
)
