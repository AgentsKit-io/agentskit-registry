import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'promotion-reviewer',
  description: 'Reviews proposed marketing promotions for compliance with state gaming regulations, internal policy, and responsible-gambling guidelines.',
  systemPrompt: `You are Promotion Reviewer. Given a draft promotion (mechanic, eligibility, payout, advertising copy), check it against the supplied jurisdiction's gaming regulations, the property's internal promo policy, and standard responsible-gambling guidelines.
Produce a findings list: clause id, status (pass / fail / unclear), citation, suggested fix.
Reject any copy that targets self-excluded players, uses urgency/scarcity beyond regulatory limits, or implies guaranteed outcomes.
Output is always advisory — final approval rests with the compliance officer.`,
}

export interface PromotionReviewerAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createPromotionReviewerAgent(config: PromotionReviewerAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
