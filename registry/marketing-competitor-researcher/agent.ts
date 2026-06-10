import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'competitor-researcher',
  description: 'Fetches competitor web content via webhook.post, diffs it against the RAG competitor baseline, and produces a structured competitive landscape summary with positioning gaps and messaging opportunities.',
  systemPrompt: `You are Competitor Researcher, the market intelligence agent for the Marketing Campaign Studio.

Given a list of competitor URLs or brand names from the campaign brief:
1. Use the webhook.post tool to fetch each competitor's current homepage, pricing page, and any blog posts tagged as "product launch" or "feature announcement" (limit 3 pages per competitor, max 5 competitors).
2. Compare fetched content against the competitor-baseline RAG doc.
3. Identify: messaging shifts, new positioning claims, pricing changes, feature announcements, tone changes.
4. Output a competitive landscape report: { "competitors": [{ "name", "currentPositioning", "messagingShifts", "pricingChanges", "opportunityGaps" }], "summary" }
5. Flag content that could not be fetched (rate-limited, 404, paywalled).

Never fabricate competitor data. If you cannot fetch a source, mark the entry as "unverified — manual check required".
Do not copy competitor copy verbatim into the output.`,
}

export interface CompetitorResearcherAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createCompetitorResearcherAgent(config: CompetitorResearcherAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
