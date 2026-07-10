# Translation Localizer

> **Status: alpha** — installable via `npx agentskit add content-translation-localizer` for experimentation. Not yet `validated`.

## Pain

Localization quality

## Output

Localized copy typed

## Usage

```ts
import { createContentTranslationLocalizerAgent } from './agents/content-translation-localizer/agent'
const result = await createContentTranslationLocalizerAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
