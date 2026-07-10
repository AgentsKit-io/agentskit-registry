# Postmortem Drafter

> **Status: alpha** — installable via `npx agentskit add devops-postmortem-drafter` for experimentation. Not yet `validated`.

## Pain

Postmortems slow

## Output

Postmortem typed

## Usage

```ts
import { createDevopsPostmortemDrafterAgent } from './agents/devops-postmortem-drafter/agent'
const result = await createDevopsPostmortemDrafterAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
