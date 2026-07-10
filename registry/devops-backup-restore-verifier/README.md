# Backup Restore Verifier

> **Status: alpha** — installable via `npx agentskit add devops-backup-restore-verifier` for experimentation. Not yet `validated`.

## Pain

Backup untested

## Output

Verification typed

## Usage

```ts
import { createDevopsBackupRestoreVerifierAgent } from './agents/devops-backup-restore-verifier/agent'
const result = await createDevopsBackupRestoreVerifierAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
