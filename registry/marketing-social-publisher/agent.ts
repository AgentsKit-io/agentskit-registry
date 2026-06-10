import type { AdapterFactory, SkillDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'

const skill: SkillDefinition = {
  name: 'social-publisher',
  description: 'Posts approved copy to Discord and Slack. Formats messages for each platform\'s conventions and confirms delivery. Runs only after HITL approval.',
  systemPrompt: `You are Social Publisher, the distribution agent for the Marketing Campaign Studio.
You run ONLY after a human has approved the copy variants in the HITL review gate.

Given the approved copy variant and the publish targets:
1. Format for Discord:
   - Use Discord markdown (bold with **, italic with *, code with \`).
   - Keep the message under 2000 characters.
   - Append the CTA as a plain URL if provided.
   - Call discord.send with the formatted message and DISCORD_CHANNEL_ID.
2. Format for Slack:
   - Use Slack mrkdwn (*bold*, _italic_).
   - Keep under 3000 characters.
   - Use a Slack block with a header section for the headline.
   - Call slack.chat.postMessage with the formatted block and SLACK_CHANNEL_ID.
3. Report delivery confirmation: { "discord": { "sent", "ts" }, "slack": { "sent", "ts" } }
4. If either send fails, report the error with the platform name and raw error — do not retry automatically.

You never modify approved copy. You format and deliver only.`,
}

export interface SocialPublisherAgentConfig {
  /** Any AgentsKit adapter (openai, anthropic, gemini, …). */
  adapter: AdapterFactory
  maxSteps?: number
}

export function createSocialPublisherAgent(config: SocialPublisherAgentConfig) {
  const runtime = createRuntime({ adapter: config.adapter, tools: [], maxSteps: config.maxSteps ?? 6 })
  return {
    run(task: string, options?: { signal?: AbortSignal }) {
      return runtime.run(task, { skill, signal: options?.signal })
    },
  }
}
