# Doc Bridge companion

[Doc Bridge](https://doc-bridge.agentskit.io/) is a companion tool for the
repository that installs a Registry agent. It is not an agent and it is not
copied from the Registry. It is published as `@agentskit/doc-bridge` and ships
the `ak-docs` CLI.

Doc Bridge reads your repository docs and ownership map, then gives an agent a
deterministic handoff: where to start reading (`startHere`), which paths it may
edit (`editRoots`), which checks prove the change (`checks`), and which human
guide explains the area (`humanDoc`).

Using Doc Bridge implies no framework lock-in. Registry agents do not require it,
and nothing in the agent source imports it.

## When to install

Either order works. `ak-docs index` builds from the files present at the time it
runs, so run it again after `npx agentskit add <id>` and after you adapt the
copied code.

- **Before adding an agent:** the index covers your docs from the start.
- **After adding an agent:** install Doc Bridge once the agent's folder exists,
  then add an ownership entry for that folder (see below) so agents can resolve
  it.

Ownership comes from any one of these: `routing.options.ownership` in
`doc-bridge.config.json`, frontmatter `package` and `editRoot` on agent docs, or
a monorepo plugin.

## Install

```bash
npm i -D @agentskit/doc-bridge
# or
pnpm add -D @agentskit/doc-bridge
```

Node 22 or newer is required. Run the binary through `npx` (or `pnpm exec`), since
a dev dependency does not put `ak-docs` on your shell PATH.

```bash
npx ak-docs init --no-demo
npx ak-docs index
npx ak-docs query package <id> --agent
```

`init` without `--no-demo` also writes a starter `example` package so you can see
a handoff immediately. `--no-demo` leaves an empty corpus for your own repository.
No API key is needed for any of these commands.

## Artifacts to expect

| Artifact | Path | What it is |
| --- | --- | --- |
| Config file | `doc-bridge.config.json` | Corpus, ownership, and gates. Requires `schemaVersion: 1` and `corpus.agent.root`. |
| Generated index | `.doc-bridge/index.json` | Machine index (`DocBridgeIndex` v1), written by `ak-docs index`. |
| Discovery file | `llms.txt` | Concise agent discovery surface, written by `ak-docs index` at the project root by default. |
| Capability map | `.doc-bridge/capabilities.json` | Capability map for MCP and other tools. |
| MCP tools | served by `ak-docs mcp` | Includes `handoff.resolve`, `doc.search`, `doc.get`, and `gate.status`. |

Commit the index and `llms.txt` only if your repository treats them as the
source of truth. Doc Bridge's own repository ignores `.doc-bridge/`. Whichever
you choose, rerun `ak-docs index` after documentation or ownership changes.

## MCP

To let an MCP-capable editor resolve handoffs before it edits:

```bash
npx ak-docs mcp install --cursor   # writes .cursor/mcp.json
npx ak-docs mcp install --claude   # merges the Claude Desktop config (macOS)
```

Run `npx ak-docs index` before starting the server in a fresh checkout. The
complete tool list is in the [MCP setup guide](https://github.com/AgentsKit-io/doc-bridge/blob/main/docs/mcp.md).

## Relation to Registry agents

[docs-chat](https://registry.agentskit.io/agents/docs-chat) answers questions over
your docs with RAG: a retriever you wire returns pages, and the agent answers only
from them. Doc Bridge does not generate answers; it resolves ownership and checks
with no model call, and it can index the same docs corpus.
[knowledge-promoter](https://registry.agentskit.io/agents/knowledge-promoter) turns
private notes into one public docs draft PR through classify, sanitize, and
leak-gate steps that include an LLM sanitizer and auditor. Doc Bridge's memory pipeline
(`npx ak-docs memory promote --pr --dry-run`) covers a similar private-notes-to-draft
flow for `.agent-memory/**` and `.cursor/rules/*.mdc`; its promotion is draft-only
and never auto-merges.

## Limits

- The core commands (`init`, `index`, `query`, `gate`, MCP) are deterministic and
  need no LLM or API key. Optional LLM remediation is a separate, explicit step.
- Doc Bridge output is routing evidence, not proof that documentation is correct.
  Human review still decides correctness.
- Layer-1 results in the [benchmark](https://github.com/AgentsKit-io/doc-bridge/blob/main/docs/bench/layer1-results-v2.md)
  report 100% native precision (15 of 15 findings) on its frozen cases. They do
  not establish general semantic accuracy.
- The Studio UI is planned for 2.1 and is not part of 2.0.
