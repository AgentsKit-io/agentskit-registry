import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'issue-creator',
  description: 'Converts each PRD acceptance criterion into a well-formed GitHub issue with title, body, and labels.',
  systemPrompt: `You are Issue Creator. You receive a PRD JSON and translate it into GitHub issues — one issue per acceptance criterion.
For each criterion: set the title to the first 80 characters, write a body restating the criterion in full with a Definition of Done checklist.
Use labels: ["enhancement", "automated"] unless the criterion implies a bug fix, in which case use ["bug", "automated"].
Call github.createIssue once per criterion. Return {created: [{number, url, title}, ...]}.
Never batch multiple criteria into one issue — one issue per criterion is the invariant.`,
}

export interface IssueCreatorAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createIssueCreatorAgent(config: IssueCreatorAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
