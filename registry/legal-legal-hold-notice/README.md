# Legal Hold Notice

> **Status: alpha** — installable via `npx agentskit add legal-legal-hold-notice` for experimentation. Not yet `validated`.

## Pain

Hold notices manual

## Output

Notice draft typed

## Usage

```ts
import { createLegalLegalHoldNoticeAgent } from './agents/legal-legal-hold-notice/agent'
const result = await createLegalLegalHoldNoticeAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
