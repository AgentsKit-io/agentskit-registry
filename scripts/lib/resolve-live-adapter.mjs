/**
 * Provider-agnostic live adapter for eval --live / --record.
 *
 * Env (highest priority first):
 *   AGENTSKIT_EVAL_PROVIDER   openai | anthropic | gemini | openrouter | ollama | …
 *   AGENTSKIT_EVAL_MODEL      model id (provider default if unset)
 *   AGENTSKIT_EVAL_API_KEY    override key (else <PROVIDER>_API_KEY)
 *   AGENTSKIT_EVAL_BASE_URL   optional base URL (local / proxy)
 *
 * Auto-detect (no AGENTSKIT_EVAL_PROVIDER): first provider with a key in env.
 * Legacy: OPENAI_EVAL_MODEL still applies when provider resolves to openai.
 */
import {
  anthropic,
  gemini,
  openai,
  deepseek,
  grok,
  groq,
  mistral,
  cohere,
  together,
  fireworks,
  openrouter,
  cerebras,
  kimi,
  huggingface,
  qwen,
  ollama,
  lmstudio,
  vllm,
  llamacpp,
} from '@agentskit/adapters'

/** @typedef {import('@agentskit/core').AdapterFactory} AdapterFactory */

/** @type {Record<string, (cfg: { apiKey: string; model: string; baseUrl?: string }) => AdapterFactory>} */
const KEYED = {
  openai,
  anthropic,
  gemini,
  deepseek,
  grok,
  groq,
  mistral,
  cohere,
  together,
  fireworks,
  openrouter,
  cerebras,
  kimi,
  huggingface,
  qwen,
  lmstudio,
  vllm,
  llamacpp,
}

/** @type {Record<string, (cfg: { model: string; baseUrl?: string }) => AdapterFactory>} */
const LOCAL = { ollama }

const LOCAL_COMPAT = new Set(['lmstudio', 'vllm', 'llamacpp'])

const DEFAULT_MODEL = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-sonnet-4-6',
  gemini: 'gemini-2.0-flash',
  deepseek: 'deepseek-chat',
  grok: 'grok-2',
  groq: 'llama-3.3-70b-versatile',
  mistral: 'mistral-large-latest',
  openrouter: 'anthropic/claude-sonnet-4',
  ollama: 'llama3',
  lmstudio: 'local-model',
  vllm: 'local-model',
  llamacpp: 'local-model',
}

/** Prefer anthropic — matches most registry README examples. */
const AUTO_DETECT_ORDER = [
  'anthropic',
  'openai',
  'openrouter',
  'gemini',
  'groq',
  'deepseek',
  'grok',
  'mistral',
  'cohere',
  'together',
  'fireworks',
  'cerebras',
  'kimi',
  'huggingface',
  'qwen',
]

function providerEnvKey(provider) {
  return `${provider.toUpperCase().replace(/-/g, '_')}_API_KEY`
}

function resolveApiKey(provider) {
  if (process.env.AGENTSKIT_EVAL_API_KEY) return process.env.AGENTSKIT_EVAL_API_KEY
  if (LOCAL[provider]) return undefined
  if (LOCAL_COMPAT.has(provider)) return process.env[providerEnvKey(provider)] ?? 'local'
  return process.env[providerEnvKey(provider)]
}

function resolveModel(provider) {
  const explicit = process.env.AGENTSKIT_EVAL_MODEL
  if (explicit) return explicit
  if (provider === 'openai' && process.env.OPENAI_EVAL_MODEL) return process.env.OPENAI_EVAL_MODEL
  return DEFAULT_MODEL[provider]
}

function resolveProvider() {
  const explicit = process.env.AGENTSKIT_EVAL_PROVIDER?.toLowerCase()
  if (explicit) return explicit

  for (const provider of AUTO_DETECT_ORDER) {
    if (resolveApiKey(provider)) return provider
  }

  if (process.env.AGENTSKIT_EVAL_BASE_URL) return 'openai'
  return undefined
}

/**
 * @returns {{ provider: string; model: string } | undefined}
 */
export function resolveLiveAdapterConfig() {
  const provider = resolveProvider()
  if (!provider) return undefined
  const model = resolveModel(provider)
  if (!model) return undefined
  return { provider, model }
}

export function hasLiveAdapterCredentials() {
  return resolveLiveAdapterConfig() !== undefined
}

export function liveAdapterHelp() {
  const keys = AUTO_DETECT_ORDER.map((p) => providerEnvKey(p)).join(', ')
  return [
    '--live / --record need a model provider. Set one of:',
    `  AGENTSKIT_EVAL_PROVIDER + AGENTSKIT_EVAL_MODEL + <PROVIDER>_API_KEY`,
    `  or any of: ${keys}`,
    '  or AGENTSKIT_EVAL_PROVIDER=ollama for local Ollama.',
  ].join('\n')
}

/**
 * @returns {AdapterFactory}
 */
export function createLiveAdapter() {
  const provider = resolveProvider()
  if (!provider) {
    throw new Error(liveAdapterHelp())
  }

  const model = resolveModel(provider)
  if (!model) {
    throw new Error(`AGENTSKIT_EVAL_MODEL required for provider "${provider}"`)
  }

  const baseUrl = process.env.AGENTSKIT_EVAL_BASE_URL

  if (LOCAL[provider]) {
    return LOCAL[provider]({ model, baseUrl })
  }

  const apiKey = resolveApiKey(provider)
  if (!apiKey) {
    throw new Error(
      `${providerEnvKey(provider)} (or AGENTSKIT_EVAL_API_KEY) required for --live / --record with provider "${provider}"`,
    )
  }

  if (KEYED[provider]) {
    return KEYED[provider]({ apiKey, model, baseUrl })
  }

  if (baseUrl) {
    return openai({ apiKey, model, baseUrl })
  }

  const known = [...Object.keys(KEYED), ...Object.keys(LOCAL)].join(', ')
  throw new Error(
    `unknown provider "${provider}". Known: ${known}. For OpenAI-compatible gateways, set AGENTSKIT_EVAL_BASE_URL.`,
  )
}