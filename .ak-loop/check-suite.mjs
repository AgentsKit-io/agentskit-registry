import { readFileSync } from 'node:fs'

const s = JSON.parse(readFileSync('./docs/bench/retrieval-suite-v1.json', 'utf8'))
const c = s.cases || s
if (!Array.isArray(c) || c.length < 20 || c.length > 40) process.exit(1)
console.log(`suite cases: ${c.length}`)
