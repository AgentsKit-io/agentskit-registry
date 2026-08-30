# Research Agent

Citation-first research agent. The [`researcher`](https://www.agentskit.io/docs/reference/packages/skills) skill wired to web search + URL fetching — every claim is anchored to a source URL.

## Add it

```bash
npx agentskit add research
```

This copies `agent.ts` into your project (default `./agents/research/`). You own the code.

## Use it

```ts
import { openai } from '@agentskit/adapters'
import { createResearchAgent } from './agents/research/agent'

const agent = createResearchAgent({
  adapter: openai({ apiKey: process.env.OPENAI_API_KEY!, model: 'gpt-4o' }),
})

const { content } = await agent.run('What changed in the EU AI Act in 2025?')
console.log(content)
```

Swap `openai` for any AgentsKit adapter (`anthropic`, `gemini`, `ollama`, …) — no lock-in.

## Use it from an MCP host

The same validated skill can be exposed as one MCP tool. Pin the bridge version
in committed host configuration and keep the default fetch/search tools explicit:

```bash
npx -y @agentskit/mcp@0.4.2 \
  --agents research \
  --provider openai \
  --model gpt-4o \
  --tools fetch,search
```

Published tarball integrity: `sha512-PzCxQwAGOySk9IDgFaoosbqETkswVAEyUuE2TdVVg9E4zRyUwq7tGRTTuzHSSg8zBmvShPpBOQNZn1brnx3FiA==`.

### Host configuration previews

These are copyable MCP configurations for Codex, Claude Code, and Cursor. The
server is stdio-only, keeps shell/filesystem disabled, and remains subject to
each host's approval prompt; host-specific conformance is still **planned**.

```bash
# Codex
codex mcp add agentskit -- npx -y @agentskit/mcp@0.4.2 --agents research --provider openai --model gpt-4o --tools fetch,search

# Claude Code
claude mcp add --scope project --transport stdio agentskit -- npx -y @agentskit/mcp@0.4.2 --agents research --provider openai --model gpt-4o --tools fetch,search
```

For Cursor, add the same stdio server to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "agentskit": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@agentskit/mcp@0.4.2", "--agents", "research", "--provider", "openai", "--model", "gpt-4o", "--tools", "fetch,search"]
    }
  }
}
```

DeepSeek Harness uses its official MCP client plugin in `cordis.yml`:

```yaml
- id: mcp-agentskit-research
  name: '@deepseek-ai/dsh-mcp-client'
  config:
    serverName: agentskit
    transport: stdio
    command: npx
    args: ['-y', '@agentskit/mcp@0.4.2', '--agents', 'research', '--provider', 'ollama', '--model', 'llama3', '--tools', 'fetch,search']
    failOnStartupError: true
```

The Harness client namespaces discovered tools as
`mcp__agentskit__fetch_url`, `mcp__agentskit__research`, and
`mcp__agentskit__web_search`. This follows the official
[`@deepseek-ai/dsh-mcp-client` contract](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/mcp/mcp-client/README.md);
the clean Harness invocation remains planned.

Set `OPENAI_API_KEY` for the OpenAI command above, or provide the provider
credentials required by the selected adapter. The DeepSeek preview uses local
Ollama (`ollama serve`, model `llama3`) so it does not require an OpenAI key.
The bridge keeps filesystem and shell tools disabled, and the host remains
responsible for its own approval policy. MCP host compatibility is currently **partial** until a clean-host
smoke test is recorded for each host. The published bridge smoke test exposed
`fetch_url`, `research`, and `web_search` over stdio; host-specific approval UX
is still being verified.

## Packages

`@agentskit/core` · `@agentskit/runtime` · `@agentskit/skills` · `@agentskit/tools`
