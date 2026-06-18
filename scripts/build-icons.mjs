#!/usr/bin/env node
/**
 * Render the brand favicon set from public/favicon.svg (one-time / static assets).
 * Produces apple-touch-icon.png, icon-192.png, icon-512.png, favicon.ico, and the
 * web app manifest. Re-run if the mark changes: `node scripts/build-icons.mjs`.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = join(root, 'public')
const svg = readFileSync(join(pub, 'favicon.svg'), 'utf8')

// Maskable/apple icons want a square; pad the 72x64 mark onto a square dark canvas.
const square = (px) => `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0D1117"/>
  <g transform="translate(6 8) scale(0.72)" stroke="#58A6FF" stroke-width="3" stroke-linecap="round" fill="none">
    <line x1="16" y1="50" x2="36" y2="16"/><line x1="36" y1="16" x2="56" y2="50"/><line x1="16" y1="50" x2="56" y2="50"/>
  </g>
  <g transform="translate(6 8) scale(0.72)" fill="#58A6FF">
    <circle cx="36" cy="16" r="7.5"/><circle cx="16" cy="50" r="7.5"/><circle cx="56" cy="50" r="7.5"/>
  </g>
</svg>`

const renderPng = (svgStr, width) =>
  new Resvg(svgStr, { fitTo: { mode: 'width', value: width } }).render().asPng()

const sizes = { 'apple-touch-icon.png': 180, 'icon-192.png': 192, 'icon-512.png': 512 }
for (const [name, px] of Object.entries(sizes)) {
  writeFileSync(join(pub, name), renderPng(square(px), px))
}

// favicon.ico = a 32x32 PNG wrapped in a single-image ICO container (PNG-in-ICO).
const png32 = renderPng(square(32), 32)
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // type: icon
header.writeUInt16LE(1, 4) // count
const entry = Buffer.alloc(16)
entry.writeUInt8(32, 0) // width
entry.writeUInt8(32, 1) // height
entry.writeUInt8(0, 2) // palette
entry.writeUInt8(0, 3) // reserved
entry.writeUInt16LE(1, 4) // planes
entry.writeUInt16LE(32, 6) // bpp
entry.writeUInt32LE(png32.length, 8) // size
entry.writeUInt32LE(22, 12) // offset
writeFileSync(join(pub, 'favicon.ico'), Buffer.concat([header, entry, png32]))

const manifest = {
  name: 'AgentsKit Registry',
  short_name: 'Registry',
  description: 'Ready-to-use AI agents for AgentsKit.',
  start_url: '/',
  display: 'standalone',
  background_color: '#0d1117',
  theme_color: '#0d1117',
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
  ],
}
writeFileSync(join(pub, 'site.webmanifest'), JSON.stringify(manifest, null, 2) + '\n')

console.log('icons built: apple-touch-icon.png, icon-192.png, icon-512.png, favicon.ico, site.webmanifest')
