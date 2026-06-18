import { execFile } from 'node:child_process'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
import { promisify } from 'node:util'
import type { ReviewTarget } from './agent'

const run = promisify(execFile)

/**
 * Source adapters normalize every input shape into the same `ReviewTarget[]` the
 * pipeline reviews. This is deterministic orchestration code (git / fs / fetch) — the
 * model only ever sees the normalized targets, never the raw ingestion.
 */

export type SourceConfig =
  | { kind: 'git-diff'; base: string; head?: string; cwd?: string }
  | { kind: 'github-pr'; owner: string; repo: string; number: number; token: string }
  | { kind: 'paths'; paths: string[]; cwd?: string }
  | { kind: 'stdin'; content: string; filename?: string }

const CODE_EXT = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.py', '.go', '.rs', '.java', '.kt',
  '.rb', '.php', '.cs', '.c', '.h', '.cpp', '.hpp', '.swift', '.scala', '.sql', '.sh', '.vue', '.svelte',
])

const langOf = (file: string): string => extname(file).replace('.', '') || 'text'

/** Parse the `+a,b` hunk headers of a unified diff into 1-based line ranges. */
function changedRanges(patch: string): Array<{ start: number; end: number }> {
  const ranges: Array<{ start: number; end: number }> = []
  for (const m of patch.matchAll(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm)) {
    const start = Number(m[1])
    const count = m[2] === undefined ? 1 : Number(m[2])
    if (count > 0) ranges.push({ start, end: start + count - 1 })
  }
  return ranges
}

async function fromGitDiff(c: Extract<SourceConfig, { kind: 'git-diff' }>): Promise<ReviewTarget[]> {
  const cwd = c.cwd ?? process.cwd()
  const head = c.head ?? 'HEAD'
  const git = async (args: string[]) => (await run('git', ['-C', cwd, ...args], { maxBuffer: 64 * 1024 * 1024 })).stdout
  const diff = await git(['diff', '--unified=0', `${c.base}...${head}`])

  const targets: ReviewTarget[] = []
  // Split the combined diff into per-file blocks.
  for (const block of diff.split(/^diff --git /m).slice(1)) {
    const pathMatch = block.match(/^a\/(.+?) b\/(.+)$/m)
    const file = pathMatch?.[2]
    if (!file || block.includes('\ndeleted file mode')) continue
    if (!CODE_EXT.has(extname(file))) continue
    let fullContent: string
    try {
      fullContent = await git(['show', `${head}:${file}`]).catch(() => readFileSync(join(cwd, file), 'utf8'))
    } catch {
      continue
    }
    targets.push({ file, language: langOf(file), fullContent, changedRanges: changedRanges(block), isChanged: true })
  }
  return targets
}

async function fromGithubPr(c: Extract<SourceConfig, { kind: 'github-pr' }>): Promise<ReviewTarget[]> {
  const api = async <T>(path: string): Promise<T> => {
    const res = await fetch(`https://api.github.com${path}`, {
      headers: { authorization: `Bearer ${c.token}`, accept: 'application/vnd.github+json', 'user-agent': 'agentskit-code-review' },
    })
    if (!res.ok) throw new Error(`GitHub ${path} → ${res.status}`)
    return res.json() as Promise<T>
  }
  const pr = await api<{ head: { sha: string } }>(`/repos/${c.owner}/${c.repo}/pulls/${c.number}`)
  const sha = pr.head.sha
  const files: Array<{ filename: string; patch?: string; status: string }> = []
  for (let page = 1; ; page++) {
    const batch = await api<typeof files>(`/repos/${c.owner}/${c.repo}/pulls/${c.number}/files?per_page=100&page=${page}`)
    files.push(...batch)
    if (batch.length < 100) break
  }
  const targets: ReviewTarget[] = []
  for (const f of files) {
    if (f.status === 'removed' || !CODE_EXT.has(extname(f.filename))) continue
    const content = await api<{ content: string; encoding: string }>(
      `/repos/${c.owner}/${c.repo}/contents/${encodeURIComponent(f.filename)}?ref=${sha}`,
    ).catch(() => null)
    if (!content) continue
    const fullContent = Buffer.from(content.content, content.encoding as BufferEncoding).toString('utf8')
    targets.push({
      file: f.filename,
      language: langOf(f.filename),
      fullContent,
      changedRanges: f.patch ? changedRanges(f.patch) : [],
      isChanged: true,
      commitId: sha,
    })
  }
  return targets
}

function walk(root: string, cwd: string, out: string[]): void {
  const abs = join(cwd, root)
  const st = statSync(abs)
  if (st.isFile()) {
    if (CODE_EXT.has(extname(root))) out.push(root)
    return
  }
  for (const entry of readdirSync(abs)) {
    if (entry === 'node_modules' || entry === '.git' || entry === 'dist') continue
    walk(join(root, entry), cwd, out)
  }
}

function fromPaths(c: Extract<SourceConfig, { kind: 'paths' }>): ReviewTarget[] {
  const cwd = c.cwd ?? process.cwd()
  const files: string[] = []
  for (const p of c.paths) walk(p, cwd, files)
  return files.map((file) => ({
    file,
    language: langOf(file),
    fullContent: readFileSync(join(cwd, file), 'utf8'),
    isChanged: false,
  }))
}

function fromStdin(c: Extract<SourceConfig, { kind: 'stdin' }>): ReviewTarget[] {
  const file = c.filename ?? 'snippet.txt'
  return [{ file, language: langOf(file), fullContent: c.content, isChanged: true }]
}

export async function loadTargets(source: SourceConfig): Promise<ReviewTarget[]> {
  switch (source.kind) {
    case 'git-diff':
      return fromGitDiff(source)
    case 'github-pr':
      return fromGithubPr(source)
    case 'paths':
      return fromPaths(source)
    case 'stdin':
      return fromStdin(source)
  }
}
