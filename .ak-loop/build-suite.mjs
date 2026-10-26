import { mkdirSync, writeFileSync } from 'node:fs'

mkdirSync('docs/bench', { recursive: true })

const cases = [
  ['question-add-agent', 'How do I add a validated agent with npx agentskit add?', 'question', 'en', ['docs/getting-started.md']],
  ['question-contribute-files', 'What files must an agent include before a pull request?', 'question', 'en', ['docs/contributing.md', 'CONTRIBUTING.md']],
  ['question-build-flow', 'How does the build turn registry source into public agent bundles?', 'question', 'en', ['docs/architecture.md']],
  ['question-catalog-generated', 'Where is the generated catalog JSON produced?', 'question', 'en', ['docs/for-agents/packages/registry-catalog.md']],
  ['question-discovery-artifact', 'How is the deterministic discovery artifact generated?', 'question', 'en', ['docs/for-agents/packages/registry-discovery.md']],
  ['question-validation-evidence', 'Where is independent validation evidence kept?', 'question', 'en', ['docs/for-agents/packages/registry-validation.md']],
  ['question-doc-bridge-companion', 'What is Doc Bridge and does an agent depend on it?', 'question', 'en', ['docs/doc-bridge.md']],
  ['question-registry-boundary', 'Who owns the generated artifacts and the boundary with the published application?', 'question', 'en', ['docs/for-agents/packages/registry-architecture.md', 'docs/architecture.md']],
  ['question-promote-draft', 'How do I promote a draft agent to validated?', 'question', 'en', ['CONTRIBUTING.md']],
  ['question-never-hand-edit', 'Which generated files must never be hand-edited?', 'question', 'en', ['docs/for-agents/index.md', 'docs/for-agents/packages/registry-catalog.md']],
  ['question-checks-before-pr', 'Which checks run before a pull request is opened?', 'question', 'en', ['docs/for-agents/index.md', 'CONTRIBUTING.md', 'docs/contributing.md']],
  ['question-human-guides', 'Where are the human guides for the published agents?', 'question', 'en', ['docs/agents/index.md']],
  ['question-application-patterns', 'What application patterns do the agents follow?', 'question', 'en', ['docs/agents/application-patterns.md']],
  ['question-report-vulnerability', 'How do I report a security vulnerability privately?', 'question', 'en', ['SECURITY.md']],
  ['question-governance', 'How are project decisions and maintainer responsibilities documented?', 'question', 'en', ['GOVERNANCE.md']],
  ['question-compose-agents', 'How do registry agents compose with other agents?', 'question', 'en', ['COMPOSING.md']],
  ['question-readme-standard', 'How is README freshness checked against the README standard?', 'question', 'en', ['docs/for-agents/packages/registry-validation.md']],
  ['question-run-research', 'How do I run the research agent?', 'question', 'en', ['registry/research/README.md']],
  ['symbol-copy-reviewer-factory', 'createCopyReviewerAgent', 'symbol', 'en', ['registry/agency-copy-reviewer/README.md']],
  ['symbol-brief-generator-factory', 'createBriefGeneratorAgent', 'symbol', 'en', ['registry/agency-brief-generator/README.md']],
  ['symbol-create-discovery-artifact', 'createRegistryDiscoveryArtifact', 'symbol', 'en', ['docs/for-agents/packages/registry-discovery.md']],
  ['symbol-validate-external-agents', 'validateExternalAgents', 'symbol', 'en', ['docs/for-agents/packages/registry-validation.md']],
  ['symbol-compute-source-hash', 'computeSourceHash', 'symbol', 'en', ['docs/for-agents/packages/registry-validation.md']],
  ['path-discovery-source', 'scripts/lib/deterministic-discovery.mjs', 'path', 'en', ['docs/for-agents/packages/registry-discovery.md']],
  ['path-catalog-output', 'public/r/catalog.json', 'path', 'en', ['docs/for-agents/packages/registry-catalog.md']],
  ['ownership-catalog', 'Which handoff owns the catalog lifecycle and its generator?', 'ownership', 'en', ['docs/for-agents/packages/registry-catalog.md']],
]

const escape = (path) => path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const suite = {
  evalFormatVersion: '2026-04',
  name: 'registry-retrieval-v1',
  description: 'Golden retrieval queries for this repository: exported symbols, paths, and natural-language questions over the maintained docs. A case passes when one of its expected targets appears in the top three results.',
  tags: ['retrieval', 'registry', 'deterministic'],
  cases: cases.map(([id, input, kind, lang, targets]) => ({
    id,
    input,
    expected: { regex: { body: targets.map(escape).join('|') } },
    metadata: { expectedTargets: targets, lang, kind },
  })),
}

writeFileSync('docs/bench/retrieval-suite-v1.json', `${JSON.stringify(suite, null, 2)}\n`)
console.log(`cases ${suite.cases.length}`)
