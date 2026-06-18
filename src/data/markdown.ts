import { Marked } from 'marked'
import { codeToHtml } from 'shiki'

// One configured Marked instance (module-scoped → set up once per build), with
// shiki syntax highlighting for fenced code blocks so README code matches the
// rest of the site's highlighted snippets.
const SUPPORTED = new Set([
  'ts', 'typescript', 'js', 'javascript', 'tsx', 'jsx', 'bash', 'sh', 'shell',
  'json', 'yaml', 'yml', 'html', 'css', 'md', 'markdown', 'python', 'py', 'diff', 'text',
])

const marked = new Marked({ gfm: true })
marked.use({
  async: true,
  async walkTokens(token) {
    if (token.type === 'code') {
      const raw = (token.lang || '').toLowerCase().split(/\s+/)[0]
      const lang = SUPPORTED.has(raw) ? raw : 'text'
      ;(token as { highlighted?: string }).highlighted = await codeToHtml(token.text, {
        lang,
        theme: 'github-dark',
      })
    }
  },
  renderer: {
    code(token) {
      return (token as { highlighted?: string }).highlighted ?? ''
    },
  },
})

export function renderMarkdown(md: string): Promise<string> {
  return marked.parse(md, { async: true }) as Promise<string>
}
