import { readFileSync } from 'node:fs'

const index = JSON.parse(readFileSync('.doc-bridge/index.json', 'utf8'))
const entries = index.projection.entries
const id = process.argv[2]
const entry = entries.find((e) => e.id === id)
console.log(JSON.stringify({ id: entry?.id, title: entry?.title, headings: entry?.fields?.headings, symbols: entry?.fields?.symbols, outbound: entry?.graph?.outbound }, null, 1).slice(0, 3000))
