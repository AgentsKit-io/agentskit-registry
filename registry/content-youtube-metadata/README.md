# YouTube Metadata

> **Status: alpha** — installable via `npx agentskit add content-youtube-metadata` for experimentation. Not yet `validated`.

## Pain

YT SEO weak

## Output

Metadata typed

## Usage

```ts
import { createContentYoutubeMetadataAgent } from './agents/content-youtube-metadata/agent'
const result = await createContentYoutubeMetadataAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
