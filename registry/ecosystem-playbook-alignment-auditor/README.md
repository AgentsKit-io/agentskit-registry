# Playbook Alignment Auditor

> **Status: draft** — not installable via `npx agentskit add` until validated.

## Pain

Registry agents must align with playbook.agentskit.io standards

## Output

Alignment findings typed vs playbook patterns

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

1. Replace the placeholder Zod schema with the real output contract.
2. Add `eval.ts` with 5+ regression cases.
3. Run `npm test && npm run build`.
4. Set `"status": "validated"` in `meta.json` and open a PR.
