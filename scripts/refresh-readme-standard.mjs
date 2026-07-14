#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { computeSourceHash } from './lib/readme-standard.mjs'

const root = process.cwd()
const path = resolve(root, 'readme-standard-v1.json')
const config = JSON.parse(readFileSync(path, 'utf8'))
for (const surface of config.surfaces) surface.freshness.sourceHash = computeSourceHash(root, surface.freshness.sources)
writeFileSync(path, `${JSON.stringify(config, null, 2)}\n`)
console.log(`README Standard v1 hashes refreshed for ${config.surfaces.length} surface.`)
