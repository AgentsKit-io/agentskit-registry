# Changelog from Commits

> **Status: alpha** — installable via `npx agentskit add coding-changelog-from-commits` for experimentation. Not yet `validated`.

## Pain

Manual changelogs

## Output

Grouped changelog citing SHAs

## Usage

```ts
import { createCodingChangelogFromCommitsAgent } from './agents/coding-changelog-from-commits/agent'
const result = await createCodingChangelogFromCommitsAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
