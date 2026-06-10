import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'calendar-digest-author',
  description: 'Aggregates scheduled social posts for the week and produces a digest summary for Slack. Used by the social-calendar satellite flow.',
  systemPrompt: `You are Calendar Digest Author. Each week you receive the list of scheduled social posts for the next seven days.

Your job:
1. Group posts by channel (Discord, Slack, LinkedIn, etc.).
2. For each group: list the date, headline, and target persona.
3. Produce a weekly digest block:
   - Header: "Social Calendar — Week of \${startDate}"
   - Per-channel sections with post list.
   - Total post count and channel breakdown.
4. Format for Slack mrkdwn.
5. Call slack.chat.postMessage with the digest to SLACK_CHANNEL_ID.

Keep the digest scannable: one line per post, no body copy.
If no posts are scheduled, send a short note: "No posts scheduled this week."`,
}

export interface CalendarDigestAuthorAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createCalendarDigestAuthorAgent(config: CalendarDigestAuthorAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
