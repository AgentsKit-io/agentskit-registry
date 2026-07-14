#!/usr/bin/env node
import { readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ids = readdirSync(join(root, 'registry'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

const checks = ['npm run validate', 'npm test', 'npm run build', 'npm run docs:bridge:gate']
const ownership = Object.fromEntries(ids.map((id) => [id, {
  path: `registry/${id}`,
  group: 'agent-catalog',
  purpose: `Registry agent: ${id}`,
  agentDoc: `registry/${id}/README.md`,
  humanDoc: `https://registry.agentskit.io/agents/${id}`,
  checks,
}]))

Object.assign(ownership, {
  'registry-architecture': {
    path: 'docs', group: 'documentation', purpose: 'Registry ownership, boundaries, quickstart, and contribution journey',
    agentDoc: 'docs/for-agents/index.md', humanDoc: 'https://registry.agentskit.io/docs/quick-start', checks,
  },
  'registry-catalog': {
    path: 'catalog', group: 'catalog', purpose: 'Agent lifecycle, stacks, policy, and catalog generation',
    agentDoc: 'docs/for-agents/index.md', humanDoc: 'https://registry.agentskit.io/docs/using', checks,
  },
  'registry-discovery': {
    path: 'scripts/lib/deterministic-discovery.mjs', group: 'discovery', purpose: 'Canonical deterministic knowledge artifact generation',
    agentDoc: 'docs/for-agents/index.md', humanDoc: 'https://registry.agentskit.io/docs/using', checks,
  },
  'registry-validation': {
    path: 'validation', group: 'validation', purpose: 'Public independent-review evidence summaries',
    agentDoc: 'docs/for-agents/index.md', humanDoc: 'https://registry.agentskit.io/docs/contributing', checks,
  },
})

const config = {
  schemaVersion: 1,
  project: { name: 'agentskit-registry' },
  corpus: {
    agent: {
      root: 'docs/for-agents',
      index: 'docs/for-agents/index.md',
      include: ['**/*.md'],
      exclude: ['**/node_modules/**'],
    },
    human: { plugin: 'plain-markdown', options: { contentDir: 'docs', urlPrefix: '/docs' } },
  },
  routing: {
    options: {
      ownership,
      intents: [
        { id: 'find-or-install-agent', title: 'Find or install a Registry agent', paths: ['docs/getting-started.md', 'public/r/index.json'] },
        { id: 'contribute-agent', title: 'Contribute a validated agent', paths: ['CONTRIBUTING.md', 'docs/contributing.md'] },
        { id: 'understand-discovery', title: 'Understand deterministic and semantic discovery', paths: ['docs/architecture.md', 'scripts/lib/deterministic-discovery.mjs'] },
      ],
      changes: [
        { id: 'change-agent', title: 'Change an agent contract or behavior', startHere: 'docs/for-agents/index.md' },
        { id: 'change-catalog', title: 'Change catalog lifecycle or metadata', startHere: 'catalog/manifest.json' },
        { id: 'change-discovery', title: 'Change local discovery answers', startHere: 'scripts/lib/deterministic-discovery.mjs' },
      ],
    },
  },
  index: {
    outFile: '.doc-bridge/index.json',
    llmsTxt: { enabled: true, outFile: '.doc-bridge/llms.txt' },
    capabilities: { enabled: true, outFile: '.doc-bridge/capabilities.json' },
  },
  gates: { preset: 'standard', include: ['documentation-standard-v1'] },
  conformance: {
    documentationStandardV1: {
      rawSources: ['README.md', 'docs/getting-started.md', 'docs/for-agents/index.md'],
      contributionPaths: ['CONTRIBUTING.md'],
      metadata: [{
        path: 'package.json',
        contains: ['"name": "agentskit-registry"', '"description":', '"homepage":', '"repository":'],
      }],
      links: [
        { url: 'https://www.agentskit.io/docs', paths: ['README.md', 'docs/getting-started.md'] },
        { url: 'https://playbook.agentskit.io/docs', paths: ['README.md', 'docs/getting-started.md'] },
        { url: 'https://github.com/AgentsKit-io/agentskit-chat', paths: ['README.md', 'docs/getting-started.md'] },
        { url: 'https://github.com/AgentsKit-io/doc-bridge', paths: ['README.md'] },
        { url: 'https://github.com/AgentsKit-io/code-review-cli', paths: ['README.md'] },
        { url: 'https://akos.agentskit.io/docs', paths: ['README.md'] },
      ],
      ecosystemContract: { manifest: 'ecosystem.json', claims: 'ecosystem-claims.json', productId: 'registry' },
      quickstarts: [{
        id: 'add-and-run', doc: 'docs/getting-started.md', test: 'scripts/quickstart.test.mjs', command: 'npm run test:quickstart',
        testContains: ['representative add and run quickstart', 'createResearchAgent'],
      }],
      visuals: ['docs/assets/agentskit-mark.svg', 'docs/assets/registry-discovery.svg'],
      diagrams: [{ path: 'docs/architecture.md', contains: ['```mermaid'] }],
    },
  },
  surfaces: {
    cli: { bin: 'ak-docs', defaultFormat: 'json' },
    mcp: { enabled: true, tools: ['handoff.resolve', 'doc.search', 'doc.get', 'gate.status', 'registry.topology'] },
  },
  federation: {
    enabled: true,
    sources: [
      { id: 'agentskit', llmsTxt: 'https://www.agentskit.io/llms.txt' },
      { id: 'playbook', llmsTxt: 'https://playbook.agentskit.io/llms.txt', rawBaseUrl: 'https://playbook.agentskit.io/raw/' },
      { id: 'agentskit-chat', llmsTxt: 'https://github.com/AgentsKit-io/agentskit-chat/blob/main/.doc-bridge/llms.txt' },
    ],
  },
}

writeFileSync(join(root, 'doc-bridge.config.json'), `${JSON.stringify(config, null, 2)}\n`)
console.log(`Doc Bridge config generated: ${ids.length} agents + 4 repository owners`)
