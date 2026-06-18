// @ts-check
import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel'

// registry.agentskit.io — landing + per-agent SEO pages + serverless MCP endpoint.
// Static by default; the MCP route opts into on-demand rendering (prerender = false),
// which the Vercel adapter ships as a serverless function. Everything in public/
// (the committed /r/*.json API, llms.txt, robots.txt) is copied through untouched.
export default defineConfig({
  site: 'https://registry.agentskit.io',
  output: 'static',
  adapter: vercel(),
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: false },
  },
})
