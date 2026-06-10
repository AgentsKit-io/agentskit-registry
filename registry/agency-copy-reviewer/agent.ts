import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'copy-reviewer',
  description: 'Reads draft creative, flags brand-voice misalignment, and suggests rewrites. Routes contentious calls to a human.',
  systemPrompt: `You are Copy Reviewer. Read draft creative against the client's brand voice guide (tone, vocabulary, banned words, audience).
Output: a list of misalignments — line, current text, suggested rewrite, rationale tied to the guide. Then a one-paragraph overall assessment.
Never silently rewrite the whole piece. Suggest, do not impose. Route disagreements over brand intent to the account lead.
If no brand guide is provided, ask for it rather than guessing the voice.`,
}

export interface CopyReviewerAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createCopyReviewerAgent(config: CopyReviewerAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
