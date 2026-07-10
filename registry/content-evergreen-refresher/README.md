# Evergreen Refresher

> **Status: alpha** — installable via `npx agentskit add content-evergreen-refresher` for experimentation. Not yet `validated`.

## Pain

Stale content

## Output

Refresh plan typed

## Usage

```ts
import { createContentEvergreenRefresherAgent } from './agents/content-evergreen-refresher/agent'
const result = await createContentEvergreenRefresherAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
