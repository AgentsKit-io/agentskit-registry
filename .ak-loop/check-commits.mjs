import { execFileSync } from 'node:child_process'

const log = execFileSync('git', ['log', 'origin/main..HEAD', '--format=%x1e%H%x1f%B'], { encoding: 'utf8' })
for (const record of log.split('\x1e').filter(Boolean)) {
  const [sha, message] = record.split('\x1f')
  const [header, ...body] = message.trimEnd().split('\n')
  const bodyLong = body.filter((line) => line.length > 100)
  console.log(sha.slice(0, 7), header.length, header.length <= 72 ? 'ok' : 'HEADER TOO LONG', bodyLong.length ? `long body lines: ${bodyLong.length}` : 'body ok')
}
