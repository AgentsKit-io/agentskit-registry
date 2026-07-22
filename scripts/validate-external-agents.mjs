#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { annotation, resolveValidationRoot, validateExternalAgents } from './lib/external-agent-validation.mjs'

const actionRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const workspace = process.argv[2]
const inputPath = process.argv[3] ?? 'agents'

if (!workspace) {
  console.error('GITHUB_WORKSPACE is required')
  process.exit(1)
}

try {
  const root = resolveValidationRoot(workspace, inputPath)
  const policy = JSON.parse(readFileSync(join(actionRoot, 'catalog/content-policy.json'), 'utf8'))
  const result = validateExternalAgents(root, policy)
  for (const error of result.errors) console.error(annotation(error, workspace))
  if (result.errors.length > 0) {
    console.error(`AgentsKit validation failed: ${result.errors.length} error(s) across ${result.agentCount} agent folder(s).`)
    process.exit(1)
  }
  console.log(`AgentsKit validation passed: ${result.agentCount} agent folder(s).`)
} catch (error) {
  console.error(`AgentsKit validation failed: ${error.message}`)
  process.exit(1)
}
