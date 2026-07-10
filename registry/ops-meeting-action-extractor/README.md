# Meeting Action Extractor

> **Status: alpha** — installable via `npx agentskit add ops-meeting-action-extractor` for experimentation. Not yet `validated`.

## Pain

Actions lost in meetings

## Output

Actions typed

## Usage

```ts
import { createOpsMeetingActionExtractorAgent } from './agents/ops-meeting-action-extractor/agent'
const result = await createOpsMeetingActionExtractorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
