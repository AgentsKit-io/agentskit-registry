# Registry Agent Spec Author

> **Status: draft** — not installable via `npx agentskit add` until validated.

## Pain

New agents need consistent specs before scaffold

## Output

Spec typed: pain, output, gates, zod shape outline

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

1. Replace the placeholder Zod schema with the real output contract.
2. Add `eval.ts` with 5+ regression cases.
3. Run `npm test && npm run build`.
4. Set `"status": "validated"` in `meta.json` and open a PR.
