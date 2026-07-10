# Doc-bridge Handoff Author

> **Status: draft** — not installable via `npx agentskit add` until validated.

## Pain

Agent handoffs between doc-bridge index and human adapters

## Output

Handoff doc typed per agent-handoff-v1 schema

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

1. Replace the placeholder Zod schema with the real output contract.
2. Add `eval.ts` with 5+ regression cases.
3. Run `npm test && npm run build`.
4. Set `"status": "validated"` in `meta.json` and open a PR.
