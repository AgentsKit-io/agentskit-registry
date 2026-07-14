#!/usr/bin/env node
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  createRegistryDiscoveryArtifact,
  createRegistrySiteConfig,
  readRegistryDiscoverySource,
} from './lib/deterministic-discovery.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'deterministic')
const result = await createRegistryDiscoveryArtifact(readRegistryDiscoverySource(root))
const siteConfig = createRegistrySiteConfig(result.artifact.contentHash)

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'knowledge.json'), result.serialized)
writeFileSync(join(outDir, 'site-config.json'), `${JSON.stringify(siteConfig, null, 2)}\n`)

console.log(`deterministic discovery built: ${result.artifact.entries.length} entries, ${result.bytes} bytes, ${result.artifact.contentHash}`)
