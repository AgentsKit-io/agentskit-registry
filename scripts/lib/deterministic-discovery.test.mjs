import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import {
  DETERMINISTIC_ARTIFACT_MAX_BYTES,
  normalizeKnowledgeKey,
  verifyLocalKnowledgeArtifactSync,
} from '@agentskit/chat-protocol'
import {
  createRegistryDiscoveryArtifact,
  createRegistrySiteConfig,
  readRegistryDiscoverySource,
} from './deterministic-discovery.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..')

const matches = (artifact, query) => {
  const normalized = normalizeKnowledgeKey(query)
  return artifact.entries.filter((entry) => entry.match.values.some((value) => normalizeKnowledgeKey(value) === normalized))
}

describe('Registry deterministic discovery artifact', () => {
  it('is canonical, fresh, bounded, and cryptographically verifiable', async () => {
    const result = await createRegistryDiscoveryArtifact(readRegistryDiscoverySource(root))
    const committed = readFileSync(join(root, 'public/deterministic/knowledge.json'), 'utf8')
    const config = JSON.parse(readFileSync(join(root, 'public/deterministic/site-config.json'), 'utf8'))

    expect(result.serialized).toBe(committed)
    expect(result.bytes).toBeLessThanOrEqual(DETERMINISTIC_ARTIFACT_MAX_BYTES)
    expect(config).toEqual(createRegistrySiteConfig(result.artifact.contentHash))
    expect(verifyLocalKnowledgeArtifactSync(JSON.parse(committed), {
      expectedContentHash: config.artifact.contentHash,
      expectedSiteId: config.siteId,
    }).ok).toBe(true)
  })

  it('answers exact IDs, install commands, categories, and capabilities locally', async () => {
    const { artifact } = await createRegistryDiscoveryArtifact(readRegistryDiscoverySource(root))

    expect(matches(artifact, 'research').map((entry) => entry.id)).toEqual(['agent:research'])
    expect(matches(artifact, 'npx agentskit add research').map((entry) => entry.id)).toEqual(['agent:research'])
    expect(matches(artifact, 'category research').map((entry) => entry.id)).toEqual(['category:research'])
    expect(matches(artifact, 'capability prompt injection defense').map((entry) => entry.id)).toEqual(['capability:prompt-injection-defense'])
    expect(matches(artifact, 'a semantic problem with no declared exact fact')).toEqual([])
  })

  it('keeps every installable agent uniquely addressable and cited', async () => {
    const source = readRegistryDiscoverySource(root)
    const { artifact } = await createRegistryDiscoveryArtifact(source)

    for (const agent of source.agents) {
      const found = matches(artifact, agent.id)
      expect(found, agent.id).toHaveLength(1)
      expect(found[0].id).toBe(`agent:${agent.id}`)
      expect(found[0].answer.markdown).toContain(`npx agentskit add ${agent.id}`)
      expect(found[0].answer.citations[0].href).toBe(`https://registry.agentskit.io/agents/${agent.id}`)
    }
  })
})
