# Red Team Debrief

> **Status: alpha** — installable via `npx agentskit add security-red-team-debrief` for experimentation. Not yet `validated`.

## Pain

Red team debriefs

## Output

Debrief typed

## Usage

```ts
import { createSecurityRedTeamDebriefAgent } from './agents/security-red-team-debrief/agent'
const result = await createSecurityRedTeamDebriefAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
