# Parent Communication

> **Status: alpha** — installable via `npx agentskit add education-parent-communication` for experimentation. Not yet `validated`.

## Pain

Parent emails

## Output

Message typed

## Usage

```ts
import { createEducationParentCommunicationAgent } from './agents/education-parent-communication/agent'
const result = await createEducationParentCommunicationAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
