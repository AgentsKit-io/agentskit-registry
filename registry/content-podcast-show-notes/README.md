# Podcast Show Notes

> **Status: alpha** — installable via `npx agentskit add content-podcast-show-notes` for experimentation. Not yet `validated`.

## Pain

Show notes manual

## Output

Notes typed

## Usage

```ts
import { createContentPodcastShowNotesAgent } from './agents/content-podcast-show-notes/agent'
const result = await createContentPodcastShowNotesAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
