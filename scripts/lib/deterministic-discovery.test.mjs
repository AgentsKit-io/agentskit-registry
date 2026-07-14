import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { beforeAll, describe, expect, it } from 'vitest'
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
let source
let result

beforeAll(async () => {
  source = readRegistryDiscoverySource(root)
  result = await createRegistryDiscoveryArtifact(source)
})

const matches = (artifact, query) => {
  const normalized = normalizeKnowledgeKey(query)
  return artifact.entries.filter((entry) => entry.match.values.some((value) => normalizeKnowledgeKey(value) === normalized))
}

describe('Registry deterministic discovery artifact', () => {
  it('is canonical, fresh, bounded, and cryptographically verifiable', async () => {
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
    const { artifact } = result

    expect(matches(artifact, 'research').map((entry) => entry.id)).toEqual(['agent:research'])
    expect(matches(artifact, 'npx agentskit add research').map((entry) => entry.id)).toEqual(['agent:research'])
    expect(matches(artifact, 'category research').map((entry) => entry.id)).toEqual(['category:research'])
    expect(matches(artifact, 'capability prompt injection defense').map((entry) => entry.id)).toEqual(['capability:prompt-injection-defense'])
    expect(matches(artifact, 'category research')[0].answer.citations[0].href).toBe('https://registry.agentskit.io/categories/research')
    expect(matches(artifact, 'capability prompt injection defense')[0].answer.citations[0].href).toBe('https://registry.agentskit.io/?q=prompt%20injection%20defense#agents')
    expect(matches(artifact, 'browse agents')[0].answer.citations[0].href).toBe('https://registry.agentskit.io/#agents')
    expect(matches(artifact, 'install an agent')[0].answer.citations[0].href).toBe('https://registry.agentskit.io/docs/quick-start')
    expect(matches(artifact, 'a semantic problem with no declared exact fact')).toEqual([])
  })

  it('keeps every installable agent uniquely addressable and cited', async () => {
    const { artifact } = result

    for (const agent of source.agents) {
      const found = matches(artifact, agent.id)
      expect(found, agent.id).toHaveLength(1)
      expect(found[0].id).toBe(`agent:${agent.id}`)
      expect(found[0].answer.markdown).toContain(`npx agentskit add ${agent.id}`)
      expect(found[0].answer.citations[0].href).toBe(`https://registry.agentskit.io/agents/${agent.id}`)
    }
  })

  it('never assigns one exact alias to multiple answers', async () => {
    const { artifact } = result
    const owners = new Map()

    for (const entry of artifact.entries) {
      for (const value of entry.match.values) {
        const key = normalizeKnowledgeKey(value)
        expect(owners.get(key), `ambiguous exact alias: ${key}`).toBeUndefined()
        owners.set(key, entry.id)
      }
    }

    expect(matches(artifact, 'meeting action extractor')).toEqual([])
    expect(matches(artifact, 'ops-meeting-action-extractor')).toHaveLength(1)
    expect(matches(artifact, 'productivity-meeting-action-extractor')).toHaveLength(1)
  })
})
