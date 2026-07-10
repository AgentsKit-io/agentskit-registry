# Breach Notification BR

> **Status: alpha** — installable via `npx agentskit add compliance-breach-notification-br` for experimentation. Not yet `validated`.

## Pain

LGPD 72h notice

## Output

Notice draft typed

## Usage

```ts
import { createComplianceBreachNotificationBrAgent } from './agents/compliance-breach-notification-br/agent'
const result = await createComplianceBreachNotificationBrAgent({ adapter }).run(input)
```

## Gates

- draft
- hitl

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
