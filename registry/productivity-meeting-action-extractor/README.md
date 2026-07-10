# Meeting Action Extractor

> **Status: alpha** — installable via `npx agentskit add productivity-meeting-action-extractor` for experimentation. Not yet `validated`.

## Pain

Meeting notes → actions

## Output

Actions typed

## Usage

```ts
import { createProductivityMeetingActionExtractorAgent } from './agents/productivity-meeting-action-extractor/agent'
const result = await createProductivityMeetingActionExtractorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
