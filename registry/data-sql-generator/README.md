# SQL Generator

> **Status: alpha** — installable via `npx agentskit add data-sql-generator` for experimentation. Not yet `validated`.

## Pain

SQL from questions

## Output

SQL typed

## Usage

```ts
import { createDataSqlGeneratorAgent } from './agents/data-sql-generator/agent'
const result = await createDataSqlGeneratorAgent({ adapter }).run(input)
```

## Gates

- read-only-default

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
