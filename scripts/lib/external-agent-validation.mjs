import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, join, relative, resolve, sep } from 'node:path'

const requiredFiles = ['agent.ts', 'meta.json', 'agent.test.ts', 'README.md']
const requiredMeta = ['id', 'title', 'description', 'category', 'packages', 'files']
const idPattern = /^[a-z][a-z0-9-]*$/
const allowedMeta = new Set([
  'id', 'title', 'description', 'version', 'source', 'license', 'requires', 'status',
  'category', 'locale', 'ecosystem', 'tags', 'packages', 'env', 'files',
])
const allowedCategories = new Set([
  'research', 'coding', 'data', 'support', 'ops', 'content', 'productivity',
  'clinical', 'fintech', 'legal', 'marketing', 'agency', 'sales', 'hr', 'devops',
  'ecommerce', 'product', 'cybersecurity', 'insurance', 'realestate', 'education',
  'compliance', 'ecosystem',
])

function readMeta(directory, errors) {
  const metaPath = join(directory, 'meta.json')
  if (!existsSync(metaPath)) return null
  try {
    return JSON.parse(readFileSync(metaPath, 'utf8'))
  } catch (error) {
    errors.push({ file: metaPath, message: `meta.json is not valid JSON: ${error.message}` })
    return null
  }
}

function agentDirectories(root) {
  if (existsSync(join(root, 'meta.json'))) return [root]
  return readdirSync(root)
    .map((entry) => join(root, entry))
    .filter((entry) => statSync(entry).isDirectory())
}

export function resolveValidationRoot(workspace, inputPath) {
  const root = resolve(workspace, inputPath)
  const workspacePrefix = `${resolve(workspace)}${sep}`
  if (root !== resolve(workspace) && !root.startsWith(workspacePrefix)) {
    throw new Error('path must stay inside GITHUB_WORKSPACE')
  }
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    throw new Error(`path is not a directory: ${inputPath}`)
  }
  return root
}

export function validateExternalAgents(root, policy) {
  const errors = []
  const directories = agentDirectories(root)
  if (directories.length === 0) errors.push({ file: root, message: 'no agent folders found' })

  for (const directory of directories) {
    const id = basename(directory)
    for (const file of requiredFiles) {
      if (!existsSync(join(directory, file))) errors.push({ file: join(directory, file), message: `missing required file ${file}` })
    }

    const meta = readMeta(directory, errors)
    if (!meta) continue
    for (const field of requiredMeta) {
      if (meta[field] == null) errors.push({ file: join(directory, 'meta.json'), message: `missing required field ${field}` })
    }
    for (const field of Object.keys(meta)) {
      if (!allowedMeta.has(field)) errors.push({ file: join(directory, 'meta.json'), message: `unknown field ${JSON.stringify(field)}` })
    }
    if (!idPattern.test(meta.id ?? '')) errors.push({ file: join(directory, 'meta.json'), message: 'id must use lowercase kebab-case' })
    if (meta.id !== id) errors.push({ file: join(directory, 'meta.json'), message: `id ${JSON.stringify(meta.id)} must match folder ${JSON.stringify(id)}` })
    for (const field of ['title', 'description']) {
      if (typeof meta[field] !== 'string' || meta[field].trim() === '') errors.push({ file: join(directory, 'meta.json'), message: `${field} must be a non-empty string` })
    }
    if (!allowedCategories.has(meta.category)) errors.push({ file: join(directory, 'meta.json'), message: `unsupported category ${JSON.stringify(meta.category)}` })
    if (!Array.isArray(meta.packages) || meta.packages.length === 0) errors.push({ file: join(directory, 'meta.json'), message: 'packages must contain at least one published dependency' })
    else if (meta.packages.some((name) => typeof name !== 'string' || name.trim() === '')) errors.push({ file: join(directory, 'meta.json'), message: 'packages must contain only non-empty strings' })
    if (!Array.isArray(meta.files) || meta.files.length === 0) errors.push({ file: join(directory, 'meta.json'), message: 'files must contain at least one copied file' })
    for (const file of Array.isArray(meta.files) ? meta.files : []) {
      const candidate = typeof file === 'string' ? resolve(directory, file) : directory
      if (typeof file !== 'string' || candidate === directory || !candidate.startsWith(`${resolve(directory)}${sep}`)) {
        errors.push({ file: join(directory, 'meta.json'), message: `meta.files contains invalid relative path ${JSON.stringify(file)}` })
      } else if (!existsSync(candidate)) errors.push({ file: candidate, message: `meta.files references missing file ${file}` })
    }
    if (policy.blockedCategories.includes(meta.category)) errors.push({ file: join(directory, 'meta.json'), message: `blocked category ${JSON.stringify(meta.category)}` })
    const tags = Array.isArray(meta.tags) ? meta.tags : []
    for (const tag of tags) {
      if (policy.blockedTagPatterns.some((pattern) => new RegExp(pattern, 'i').test(tag))) {
        errors.push({ file: join(directory, 'meta.json'), message: `blocked tag ${JSON.stringify(tag)}` })
      }
    }
    for (const field of ['title', 'description']) {
      if (policy.blockedTitlePatterns.some((pattern) => new RegExp(pattern, 'i').test(meta[field] ?? ''))) {
        errors.push({ file: join(directory, 'meta.json'), message: `blocked content pattern in ${field}` })
      }
    }
  }

  return { agentCount: directories.length, errors }
}

export function annotation(error, workspace) {
  const file = relative(workspace, error.file).split(sep).join('/')
  return `::error file=${file}::${error.message}`
}
