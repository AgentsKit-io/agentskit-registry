# Transcript Cleaner

> **Status: alpha** — installable via `npx agentskit add content-transcript-cleaner` for experimentation. Not yet `validated`.

## Pain

Messy transcripts

## Output

Clean transcript typed

## Usage

```ts
import { createContentTranscriptCleanerAgent } from './agents/content-transcript-cleaner/agent'
const result = await createContentTranscriptCleanerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
