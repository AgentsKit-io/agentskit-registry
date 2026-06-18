import type { APIRoute } from 'astro'
import { getIndex } from '../data/registry'
import { locales, localizedPath } from '../i18n/ui'

const SITE = 'https://registry.agentskit.io'

export const GET: APIRoute = () => {
  const paths = ['/', ...getIndex().map((a) => `/agents/${a.id}`)]
  const urls: string[] = []
  for (const p of paths) {
    for (const l of locales) {
      const loc = SITE + localizedPath(p, l)
      const alts = locales
        .map(
          (al) =>
            `<xhtml:link rel="alternate" hreflang="${al === 'pt' ? 'pt-BR' : al}" href="${SITE + localizedPath(p, al)}"/>`,
        )
        .join('')
      urls.push(
        `<url><loc>${loc}</loc>${alts}<xhtml:link rel="alternate" hreflang="x-default" href="${SITE + localizedPath(p, 'en')}"/><changefreq>weekly</changefreq></url>`,
      )
    }
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } })
}
