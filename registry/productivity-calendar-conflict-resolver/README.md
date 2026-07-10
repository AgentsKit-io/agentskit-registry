# Calendar Conflict Resolver

> **Status: alpha** — installable via `npx agentskit add productivity-calendar-conflict-resolver` for experimentation. Not yet `validated`.

## Pain

Scheduling conflicts

## Output

Options typed

## Usage

```ts
import { createProductivityCalendarConflictResolverAgent } from './agents/productivity-calendar-conflict-resolver/agent'
const result = await createProductivityCalendarConflictResolverAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
