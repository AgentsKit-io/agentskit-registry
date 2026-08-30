export const RUNNER_TARGETS = Object.freeze([
  'mcp',
  'codex',
  'claude',
  'cursor',
  'deepseek',
  'gemini',
  'kimi',
  'grok',
  'hermes',
])

export const PROJECTION_STATUSES = Object.freeze([
  'verified',
  'partial',
  'planned',
  'unsupported',
])

const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

const assertStatus = (value, label) => {
  if (!PROJECTION_STATUSES.includes(value)) {
    throw new Error(`${label} must be one of ${PROJECTION_STATUSES.join(', ')}`)
  }
}

/**
 * Build the public runner matrix without claiming host support prematurely.
 * `partial` for MCP means the source bundle is consumable by @agentskit/mcp;
 * a clean host smoke test is still required before changing it to `verified`.
 */
export function createRunnerProjections({ id, installable, runnable, overrides = {} }) {
  if (typeof id !== 'string' || id.trim() === '') throw new Error('runner projection id is required')
  if (typeof installable !== 'boolean' || typeof runnable !== 'boolean') {
    throw new Error('runner projection installable and runnable flags are required')
  }
  if (!isRecord(overrides)) throw new Error('runner projection overrides must be an object')

  const unavailable = { status: installable ? 'planned' : 'unsupported' }
  const projections = {
    source: {
      status: installable ? 'verified' : 'unsupported',
      command: `npx agentskit add ${id}`,
    },
    mcp: {
      status: installable && runnable ? 'partial' : 'unsupported',
      transport: 'stdio',
      package: '@agentskit/mcp',
    },
    codex: { ...unavailable },
    claude: { ...unavailable },
    cursor: { ...unavailable },
    deepseek: { ...unavailable },
    gemini: { ...unavailable },
    kimi: { ...unavailable },
    grok: { ...unavailable },
    hermes: { ...unavailable },
  }

  for (const [target, override] of Object.entries(overrides)) {
    if (!(target in projections)) throw new Error(`unknown runner projection target: ${target}`)
    if (!isRecord(override)) throw new Error(`${target} runner projection must be an object`)
    assertStatus(override.status, `${target}.status`)
    projections[target] = { ...projections[target], ...override }
  }

  return projections
}
