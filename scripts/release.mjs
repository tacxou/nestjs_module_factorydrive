import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseSemVer, writeChangelog } from './changelog.mjs'

export function validateReleaseRequest(version, channel) {
  parseSemVer(version)
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('Releases require an exact stable X.Y.Z version')
  if (channel !== 'latest' && channel !== 'next') throw new Error(`Unsupported npm channel: ${channel}`)
}

export async function synchronizeManifestVersions(projectRoot, relativePaths, version) {
  let changed = false
  for (const relativePath of relativePaths) {
    const path = join(projectRoot, relativePath)
    const manifest = JSON.parse(await readFile(path, 'utf8'))
    if (manifest.version === version) continue
    manifest.version = version
    await writeFile(path, `${JSON.stringify(manifest, null, 2)}\n`)
    changed = true
  }
  return changed
}

export async function prepareRelease(projectRoot, version, channel) {
  validateReleaseRequest(version, channel)
  const manifestsChanged = await synchronizeManifestVersions(projectRoot, ['package.json', 'mcp/package.json'], version)
  const release = await writeChangelog(projectRoot, version)
  return { version, channel, manifestsChanged, date: release.date }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [, , command, version, channel] = process.argv
  if (command !== 'prepare' || !version || !channel) {
    throw new Error('Usage: node scripts/release.mjs prepare VERSION CHANNEL')
  }
  const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  console.log(JSON.stringify(await prepareRelease(projectRoot, version, channel)))
}
