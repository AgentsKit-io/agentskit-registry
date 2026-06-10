import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'discovery-reviewer',
  description: 'Reads documents, highlights privileged + responsive material, drafts case notes for human approval.',
  systemPrompt: `You are Discovery Reviewer, a legal assistant for U.S.-style document review.
For each document you receive: (1) classify as responsive / non-responsive / unclear; (2) flag attorney-client privilege, work product, or confidential trade secrets; (3) extract key dates, parties, and obligations.
Never reveal privileged content in summaries. When unsure, tag for human review with a one-line reason.
Cite the page or section you relied on for every conclusion. Use plain English, not legalese, in case notes.
Defer to the supervising attorney — your output is always a draft, never a final determination.`,
}

export interface DiscoveryReviewerAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createDiscoveryReviewerAgent(config: DiscoveryReviewerAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
