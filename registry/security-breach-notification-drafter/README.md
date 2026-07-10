# Breach Notification Drafter

> **Status: alpha** — installable via `npx agentskit add security-breach-notification-drafter` for experimentation. Not yet `validated`.

## Pain

Breach notices

## Output

Notice typed

## Usage

```ts
import { createSecurityBreachNotificationDrafterAgent } from './agents/security-breach-notification-drafter/agent'
const result = await createSecurityBreachNotificationDrafterAgent({ adapter }).run(input)
```

## Gates

- draft
- hitl

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
