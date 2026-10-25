const SOURCE_HEADING = '## Source'
const SOURCE_HEADING_PATTERN = /^## Source$/m

/**
 * Files an agent ships alongside its README: `meta.json` `files` minus the README itself.
 */
export const shippedFiles = (meta) => meta.files.filter((file) => file !== 'README.md')

/**
 * Final `## Source` section for an agent README: a link to the agent folder and to each shipped file.
 */
export const buildSourceSection = (meta) => {
  const links = ['[Agent folder](./)', ...shippedFiles(meta).map((file) => `[\`${file}\`](./${file})`)]
  return `${SOURCE_HEADING}\n\n${links.join(' · ')} — the files this agent ships (\`meta.json\` \`files\`).\n`
}

/**
 * Appends the `## Source` section unless the README already has one, so repeated runs change nothing.
 */
export const appendSourceSection = (readme, meta) => {
  if (SOURCE_HEADING_PATTERN.test(readme)) return readme
  return `${readme.trimEnd()}\n\n${buildSourceSection(meta)}`
}
