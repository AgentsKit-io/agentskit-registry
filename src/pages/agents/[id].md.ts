import type { APIRoute } from 'astro'
import { getIndex, getAgent, getReadme, installCommand, bundleUrl, agentPrompt, getSource } from '../../data/registry'

export function getStaticPaths() {
  return getIndex().map((a) => ({ params: { id: a.id } }))
}

// Machine-readable per-agent markdown — clean context for LLMs / coding agents.
export const GET: APIRoute = ({ params }) => {
  const id = params.id!
  const b = getAgent(id)
  const readme = getReadme(id, 'en')
  const source = getSource(b, 'agent.ts')
  const md = [
    `# ${b.title}`,
    ``,
    `> ${b.description}`,
    ``,
    `- id: \`${b.id}\``,
    `- category: ${b.category}`,
    `- version: ${b.version ?? '1.0.0'}`,
    `- license: ${b.license ?? 'MIT'}`,
    `- runnable: ${b.runnable}`,
    `- packages: ${(b.packages ?? []).join(', ')}`,
    `- JSON bundle: ${bundleUrl(b.id)}`,
    ``,
    `## Install`,
    ``,
    '```bash',
    installCommand(b.id),
    '```',
    ``,
    `## Copy for your agent`,
    ``,
    '```text',
    agentPrompt(b),
    '```',
    source ? `\n## Source (agent.ts)\n\n\`\`\`ts\n${source}\n\`\`\`` : '',
    readme ? `\n## README\n\n${readme.replace(/^#\s+.+\n+/, '')}` : '',
    '',
  ].join('\n')

  return new Response(md, {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  })
}
