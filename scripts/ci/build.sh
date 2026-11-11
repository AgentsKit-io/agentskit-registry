#!/usr/bin/env bash
# CI build stage: build the registry, then check every generated artifact is committed.
set -euo pipefail

npm run eval:run -- --ecosystem-doc-bridge
npm run build
npm run docs:bridge:index
npm run docs:bridge:gate
npm run docs:bridge:conformance
if ! git diff --exit-code public ecosystem-claims.json doc-bridge.config.json .doc-bridge; then
  echo "Generated Registry artifacts are stale: regenerate and commit them."
  exit 1
fi
