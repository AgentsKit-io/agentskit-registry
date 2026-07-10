# Messaging Hierarchy

> **Status: alpha** — installable via `npx agentskit add marketing-messaging-hierarchy` for experimentation. Not yet `validated`.

## Pain

Inconsistent messaging

## Output

Hierarchy typed

## Usage

```ts
import { createMarketingMessagingHierarchyAgent } from './agents/marketing-messaging-hierarchy/agent'
const result = await createMarketingMessagingHierarchyAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
