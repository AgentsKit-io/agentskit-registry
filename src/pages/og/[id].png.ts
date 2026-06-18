import type { APIRoute } from 'astro'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { getIndex, getAgent } from '../../data/registry'

export function getStaticPaths() {
  return [...getIndex().map((a) => ({ params: { id: a.id } })), { params: { id: 'default' } }]
}

const fontDir = join(process.cwd(), 'src', 'assets', 'fonts')
const fontRegular = readFileSync(join(fontDir, 'Inter-Regular.woff'))
const fontBold = readFileSync(join(fontDir, 'Inter-Bold.woff'))

const BG = '#0d1117'
const ACCENT = '#58a6ff'
const TEXT = '#e6edf3'
const MUTED = '#9aa7b5'

type El = { type: string; props: Record<string, unknown> }
const h = (type: string, style: Record<string, unknown>, children?: unknown): El => ({
  type,
  props: { style, ...(children !== undefined ? { children } : {}) },
})

function buildTree(eyebrow: string, title: string, sub: string, cmd: string): El {
  return h(
    'div',
    {
      display: 'flex',
      flexDirection: 'column',
      width: '1200px',
      height: '630px',
      backgroundColor: BG,
      backgroundImage: `radial-gradient(circle at 10% -15%, ${ACCENT}40, transparent 45%), radial-gradient(circle at 105% 10%, #8b5cf640, transparent 42%)`,
      padding: '72px',
      justifyContent: 'space-between',
      fontFamily: 'Inter',
    },
    [
      h('div', { display: 'flex', alignItems: 'center' }, [
        h(
          'div',
          {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: 14,
            backgroundColor: ACCENT,
            color: '#0a1422',
            fontSize: 36,
            fontWeight: 700,
          },
          'A',
        ),
        h(
          'div',
          { display: 'flex', marginLeft: 18, color: TEXT, fontSize: 30, fontWeight: 700 },
          'AgentsKit Registry',
        ),
      ]),
      h('div', { display: 'flex', flexDirection: 'column' }, [
        h(
          'div',
          { display: 'flex', color: ACCENT, fontSize: 24, fontWeight: 700, letterSpacing: 2 },
          eyebrow,
        ),
        h(
          'div',
          {
            display: 'flex',
            color: TEXT,
            fontSize: 78,
            fontWeight: 700,
            lineHeight: 1.05,
            marginTop: 16,
            maxWidth: 1040,
          },
          title,
        ),
        h(
          'div',
          { display: 'flex', color: MUTED, fontSize: 30, marginTop: 22, maxWidth: 980, lineHeight: 1.35 },
          sub,
        ),
      ]),
      h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
        h(
          'div',
          {
            display: 'flex',
            backgroundColor: '#161c27',
            border: `1px solid #222b38`,
            borderRadius: 12,
            padding: '14px 24px',
            color: TEXT,
            fontSize: 28,
          },
          cmd,
        ),
        h('div', { display: 'flex', color: MUTED, fontSize: 26 }, 'registry.agentskit.io'),
      ]),
    ],
  )
}

export const GET: APIRoute = async ({ params }) => {
  const id = params.id!
  let eyebrow = 'AGENTSKIT REGISTRY'
  let title = 'Ready-to-use AI agents'
  let sub = 'Copy the source into your project — shadcn-style. No lock-in.'
  let cmd = 'npx agentskit add <id>'

  if (id !== 'default') {
    const b = getAgent(id)
    eyebrow = `REGISTRY · ${b.category.toUpperCase()}`
    title = b.title
    sub = b.description.length > 128 ? b.description.slice(0, 125) + '…' : b.description
    cmd = `npx agentskit add ${id}`
  }

  const svg = await satori(buildTree(eyebrow, title, sub, cmd) as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
      { name: 'Inter', data: fontBold, weight: 700, style: 'normal' },
    ],
  })
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
  return new Response(new Uint8Array(png), {
    headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=31536000, immutable' },
  })
}
