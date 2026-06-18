import type { AgentBundle, AgentSummary } from './registry'
import { localizedPath, type Locale } from '../i18n/ui'

const SITE = 'https://registry.agentskit.io'
const ORG = {
  '@type': 'Organization',
  name: 'AgentsKit',
  url: 'https://www.agentskit.io',
}

export function websiteLd(locale: Locale, agents: AgentSummary[]) {
  const url = SITE + localizedPath('/', locale)
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'AgentsKit Registry',
      url,
      description: 'Ready-to-use AI agents for AgentsKit — copy the source, own the code.',
      inLanguage: locale,
      publisher: ORG,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'AgentsKit agents',
      numberOfItems: agents.length,
      itemListElement: agents.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: SITE + localizedPath(`/agents/${a.id}`, locale),
        name: a.title,
      })),
    },
  ]
}

export function agentLd(bundle: AgentBundle, locale: Locale) {
  const url = SITE + localizedPath(`/agents/${bundle.id}`, locale)
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: bundle.title,
      description: bundle.description,
      url,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Cross-platform',
      softwareVersion: bundle.version ?? '1.0.0',
      programmingLanguage: 'TypeScript',
      license: 'https://opensource.org/licenses/MIT',
      author: ORG,
      publisher: ORG,
      identifier: `io.agentskit.registry.${bundle.id}`,
      downloadUrl: `${SITE}/r/${bundle.id}.json`,
      installUrl: url,
      keywords: (bundle.tags ?? []).join(', '),
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      inLanguage: locale,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Registry', item: SITE + localizedPath('/', locale) },
        { '@type': 'ListItem', position: 2, name: bundle.title, item: url },
      ],
    },
  ]
}
