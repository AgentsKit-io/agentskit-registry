import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import {
  DETERMINISTIC_ARTIFACT_MAX_BYTES,
  DETERMINISTIC_KNOWLEDGE_PROTOCOL,
  DETERMINISTIC_KNOWLEDGE_PROTOCOL_VERSION,
  DETERMINISTIC_SITE_PROTOCOL,
  DETERMINISTIC_SITE_PROTOCOL_VERSION,
  LocalKnowledgeArtifactSchema,
  computeLocalKnowledgeArtifactContentHash,
  normalizeKnowledgeKey,
} from '@agentskit/chat-protocol'

const SITE = 'https://registry.agentskit.io'
const MAX_LISTED_AGENTS = 8

const uniqueAliases = (values) => {
  const seen = new Set()
  return values.filter((value) => {
    const normalized = normalizeKnowledgeKey(value)
    if (seen.has(normalized)) return false
    seen.add(normalized)
    return true
  })
}

const citation = (id, title, href) => ({ id, title, href })

const listAgents = (agents, overflowHref, overflowLabel = `View all ${agents.length} matches`) => {
  const visible = agents.slice(0, MAX_LISTED_AGENTS)
  const lines = visible.map((agent) => `- [${agent.title}](${SITE}/agents/${agent.id}) — \`${agent.id}\``)
  if (agents.length > visible.length) lines.push(`- [${overflowLabel}](${overflowHref})`)
  return lines.join('\n')
}

const agentAliasCandidates = (agent) => uniqueAliases([
  agent.id,
  agent.title,
  agent.title.replace(/\bagent\b/giu, '').trim(),
  `agent ${agent.id}`,
  `install ${agent.id}`,
  `add ${agent.id}`,
  `npx agentskit add ${agent.id}`,
])

const categoryAliases = (category, reserved) => uniqueAliases([
  ...(reserved.has(normalizeKnowledgeKey(category)) ? [] : [category]),
  `category ${category}`,
  `${category} agents`,
  `agents for ${category}`,
])

const capabilityAliases = (capability, reserved) => {
  const spaced = capability.replaceAll('-', ' ')
  const bare = [capability, spaced].filter((value) => !reserved.has(normalizeKnowledgeKey(value)))
  return uniqueAliases([
    ...bare,
    `capability ${capability}`,
    `capability ${spaced}`,
    `${spaced} capability`,
    `agents with ${spaced}`,
  ])
}

export const createRegistryDiscoveryArtifact = async ({ agents, generatedAt }) => {
  const sorted = [...agents].sort((left, right) => left.id.localeCompare(right.id))
  const aliasOwners = new Map()
  for (const agent of sorted) {
    for (const alias of agentAliasCandidates(agent)) {
      const normalized = normalizeKnowledgeKey(alias)
      const owners = aliasOwners.get(normalized) ?? new Set()
      owners.add(agent.id)
      aliasOwners.set(normalized, owners)
    }
  }
  const agentAliases = (agent) => agentAliasCandidates(agent)
    .filter((alias) => aliasOwners.get(normalizeKnowledgeKey(alias))?.size === 1)
  const reserved = new Set(sorted.flatMap((agent) => agentAliases(agent).map(normalizeKnowledgeKey)))
  const categories = [...new Set(sorted.map((agent) => agent.category))].sort()
  const categorySet = new Set(categories)
  for (const category of categories) {
    for (const alias of categoryAliases(category, reserved)) reserved.add(normalizeKnowledgeKey(alias))
  }
  for (const value of ['agentskit', 'agentskit framework', 'playbook', 'agents playbook', 'agentskit chat', 'agentschat', 'doc bridge', 'doc-bridge', 'contribute']) {
    reserved.add(normalizeKnowledgeKey(value))
  }

  const agentEntries = sorted.map((agent) => ({
    id: `agent:${agent.id}`,
    kind: 'package',
    label: agent.title,
    match: { type: 'exact', values: agentAliases(agent) },
    answer: {
      markdown: [
        `## ${agent.title}`,
        '',
        agent.description,
        '',
        `Install: \`npx agentskit add ${agent.id}\``,
        '',
        `Category: **${agent.category}** · Status: **${agent.status ?? 'validated'}**`,
        (agent.tags ?? []).length ? `Capabilities: ${(agent.tags ?? []).map((tag) => `\`${tag}\``).join(', ')}` : undefined,
        '',
        `[Open the agent page](${SITE}/agents/${agent.id})`,
      ].filter((line) => line !== undefined).join('\n'),
      citations: [citation(`agent:${agent.id}`, agent.title, `${SITE}/agents/${agent.id}`)],
    },
  }))

  const categoryEntries = categories.map((category) => {
    const matches = sorted.filter((agent) => agent.category === category)
    const href = `${SITE}/categories/${encodeURIComponent(category)}`
    return {
      id: `category:${category}`,
      kind: 'navigation',
      label: `${category} agents`,
      match: { type: 'exact', values: categoryAliases(category, new Set(sorted.flatMap((agent) => agentAliases(agent).map(normalizeKnowledgeKey)))) },
      answer: {
        markdown: `## ${matches.length} ${category} agents\n\n${listAgents(matches, href)}`,
        citations: [citation(`category:${category}`, `${category} agents`, href)],
      },
    }
  })

  const capabilities = [...new Set(sorted.flatMap((agent) => agent.tags ?? []))]
    .filter((capability) => !categorySet.has(capability))
    .sort()
  const capabilityEntries = capabilities.map((capability) => {
    const matches = sorted.filter((agent) => (agent.tags ?? []).includes(capability))
    const href = `${SITE}/#agents`
    return {
      id: `capability:${capability}`,
      kind: 'navigation',
      label: `${capability} capability`,
      match: { type: 'exact', values: capabilityAliases(capability, reserved) },
      answer: {
        markdown: `## ${matches.length} agents with ${capability}\n\n${listAgents(matches, href, 'Browse the full catalog')}`,
        citations: [citation(`capability:${capability}`, `${capability} agents`, href)],
      },
    }
  })

  const navigationEntries = [
    {
      id: 'command:add', kind: 'command', label: 'Install an agent',
      values: ['install an agent', 'add an agent', 'agentskit add', 'registry install command'],
      markdown: 'Install any Registry agent with `npx agentskit add <agent-id>`. The CLI copies readable source into your project, so you own and can edit it.',
      title: 'Install from AgentsKit Registry', href: `${SITE}/docs/quick-start`,
    },
    {
      id: 'nav:catalog', kind: 'navigation', label: 'Browse all agents',
      values: ['browse agents', 'all agents', 'agent catalog', 'registry catalog'],
      markdown: `Browse all ${sorted.length} validated agents by category and capability.`,
      title: 'AgentsKit Registry catalog', href: `${SITE}/#agents`,
    },
    {
      id: 'nav:contribute', kind: 'contribution', label: 'Contribute an agent',
      values: ['contribute', 'contribute an agent', 'registry contribution', 'add an agent to registry'],
      markdown: 'Contributions are welcome. Start from the contribution guide, follow the agent structure and validation bar, then open a pull request.',
      title: 'Contribute to AgentsKit Registry', href: 'https://github.com/AgentsKit-io/agentskit-registry/blob/main/CONTRIBUTING.md',
    },
    {
      id: 'ecosystem:agentskit', kind: 'ecosystem', label: 'AgentsKit framework',
      values: ['agentskit', 'agentskit framework', 'framework'],
      markdown: 'AgentsKit is the parent framework. Registry agents compose its published runtime, adapters, skills, tools, memory, and RAG packages.',
      title: 'AgentsKit documentation', href: 'https://www.agentskit.io/docs',
    },
    {
      id: 'ecosystem:playbook', kind: 'ecosystem', label: 'Agents Playbook',
      values: ['agents playbook', 'playbook', 'agent engineering playbook'],
      markdown: 'Use the Agents Playbook for production engineering practices, review discipline, safety gates, and contribution recipes.',
      title: 'Agents Playbook', href: 'https://playbook.agentskit.io/docs',
    },
    {
      id: 'ecosystem:chat', kind: 'ecosystem', label: 'AgentsKit Chat',
      values: ['agentskit chat', 'agentschat', 'chat framework'],
      markdown: 'AgentsKit Chat turns one AgentsKit behavior definition into native interactive experiences across React, React Native, Ink, Vue, Svelte, Solid, and Angular.',
      title: 'AgentsKit Chat', href: 'https://github.com/AgentsKit-io/agentskit-chat',
    },
    {
      id: 'ecosystem:doc-bridge', kind: 'ecosystem', label: 'Doc Bridge',
      values: ['doc bridge', 'doc-bridge', 'documentation bridge'],
      markdown: 'Doc Bridge turns repository documentation into validated indexes, machine-readable context, and precise handoffs for coding agents.',
      title: 'Doc Bridge', href: 'https://github.com/AgentsKit-io/doc-bridge',
    },
  ].map((entry) => ({
    id: entry.id,
    kind: entry.kind,
    label: entry.label,
    match: { type: 'exact', values: entry.values },
    answer: { markdown: entry.markdown, citations: [citation(entry.id, entry.title, entry.href)] },
  }))

  const artifactWithoutHash = {
    protocol: DETERMINISTIC_KNOWLEDGE_PROTOCOL,
    version: DETERMINISTIC_KNOWLEDGE_PROTOCOL_VERSION,
    artifactId: 'agentskit-registry',
    siteId: 'registry',
    generatedAt,
    entries: [...agentEntries, ...categoryEntries, ...capabilityEntries, ...navigationEntries],
  }
  const contentHash = await computeLocalKnowledgeArtifactContentHash(artifactWithoutHash)
  const artifact = LocalKnowledgeArtifactSchema.parse({ ...artifactWithoutHash, contentHash })
  const serialized = `${JSON.stringify(artifact, null, 2)}\n`
  const bytes = new TextEncoder().encode(serialized).byteLength
  if (bytes > DETERMINISTIC_ARTIFACT_MAX_BYTES) {
    throw new Error(`deterministic artifact is ${bytes} bytes; limit is ${DETERMINISTIC_ARTIFACT_MAX_BYTES}`)
  }
  return { artifact, serialized, bytes }
}

export const readRegistryDiscoverySource = (root) => {
  const registryDir = join(root, 'registry')
  const agents = readdirSync(registryDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => JSON.parse(readFileSync(join(registryDir, entry.name, 'meta.json'), 'utf8')))
    .filter((agent) => (agent.status ?? 'validated') !== 'draft')
  const manifest = JSON.parse(readFileSync(join(root, 'catalog', 'manifest.json'), 'utf8'))
  return { agents, generatedAt: manifest.generatedAt }
}

export const createRegistrySiteConfig = (contentHash) => ({
  protocol: DETERMINISTIC_SITE_PROTOCOL,
  version: DETERMINISTIC_SITE_PROTOCOL_VERSION,
  siteId: 'registry',
  artifact: {
    href: '/deterministic/knowledge.json',
    contentHash,
  },
  fallback: { mode: 'backend' },
})
