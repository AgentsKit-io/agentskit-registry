import { existsSync, readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const ids = readdirSync(join(root, 'registry')).filter((name) => statSync(join(root, 'registry', name)).isDirectory()).sort()
let changed = 0
const skipped = []
for (const id of ids) {
  const path = join(root, 'registry', id, 'README.md')
  if (!existsSync(path)) {
    skipped.push(`${id}: no README`)
    continue
  }
  const text = readFileSync(path, 'utf8')
  if (text.startsWith('---')) {
    skipped.push(`${id}: already has front matter`)
    continue
  }
  const block = `---\ndocbridge:\n  covers:\n    - area:registry/${id}\n---\n\n`
  writeFileSync(path, block + text)
  changed += 1
}
console.log(`changed ${changed} of ${ids.length}`)
for (const line of skipped) console.log(line)
