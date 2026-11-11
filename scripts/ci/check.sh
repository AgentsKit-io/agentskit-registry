#!/usr/bin/env bash
# Static checks of the CI lint stage: typecheck and the registry's structure rules.
set -euo pipefail

npm run docs:bridge:config
npm run lint
npm run check:no-legacy-chat-imports
npm run validate
