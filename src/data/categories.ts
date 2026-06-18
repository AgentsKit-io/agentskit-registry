import { getIndex } from './registry'

// Presentational metadata per category. Labels + blurbs are localized in src/i18n/ui.ts;
// here we only keep the icon + a stable display order. Unknown categories fall back gracefully.
export const CATEGORY_ICONS: Record<string, string> = {
  agency: 'megaphone',
  marketing: 'trending-up',
  coding: 'code',
  research: 'search',
  legal: 'scale',
  fintech: 'landmark',
  clinical: 'heart-pulse',
  support: 'life-buoy',
  ops: 'git-branch',
}

const ORDER = ['coding', 'research', 'marketing', 'agency', 'support', 'legal', 'fintech', 'clinical', 'ops']

export type CategoryStat = { id: string; count: number; icon: string }

export function getCategories(): CategoryStat[] {
  const counts = new Map<string, number>()
  for (const a of getIndex()) counts.set(a.category, (counts.get(a.category) ?? 0) + 1)
  return [...counts.entries()]
    .map(([id, count]) => ({ id, count, icon: CATEGORY_ICONS[id] ?? 'box' }))
    .sort((a, b) => {
      const ai = ORDER.indexOf(a.id)
      const bi = ORDER.indexOf(b.id)
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    })
}
