import { readdir, readFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SITE_PREFIX = 'https://ficsysfr.github.io/nestjs_module_factorydrive/'
const FORBIDDEN_INTERNAL_MARKERS = ['AGENTS.md', 'CLAUDE.md', 'conventional-commits', 'references-patterns', 'specs/']

export function validateDocsArtifacts({ index, full, markdownFiles, expectedPaths }) {
  const matches = [...index.matchAll(/^- \[[^\]]+]\((https?:\/\/[^)]+\.md)\)(?::.*)?$/gm)]
  const links = matches.map((match) => match[1])

  if (links.length === 0) throw new Error('llms.txt does not contain any Markdown links')
  if (new Set(links).size !== links.length) throw new Error('llms.txt contains duplicate links')

  for (const link of links) {
    if (!link.startsWith(`${SITE_PREFIX}en/`)) {
      throw new Error(`llms.txt contains a non-English or off-site link: ${link}`)
    }
  }

  const actualPaths = links.map((link) => link.slice(SITE_PREFIX.length)).sort()
  const wantedPaths = [...expectedPaths].sort()
  if (JSON.stringify(actualPaths) !== JSON.stringify(wantedPaths)) {
    throw new Error(`llms.txt paths differ from English sources: ${actualPaths.join(', ')}`)
  }

  const generatedPaths = [...markdownFiles].sort()
  if (JSON.stringify(generatedPaths) !== JSON.stringify(wantedPaths)) {
    throw new Error(`Generated Markdown variants differ from English sources: ${generatedPaths.join(', ')}`)
  }

  for (const link of links) {
    if (!full.includes(link)) throw new Error(`llms-full.txt is missing ${link}`)
  }

  for (const marker of FORBIDDEN_INTERNAL_MARKERS) {
    if (index.includes(marker) || full.includes(marker)) {
      throw new Error(`LLM documentation exposes internal material: ${marker}`)
    }
  }

  return { linkCount: links.length, links }
}

async function listMarkdownFiles(directory, root = directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...(await listMarkdownFiles(path, root)))
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(relative(root, path).replaceAll('\\', '/'))
  }
  return files
}

export async function checkDocsBuild(projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')) {
  const docsRoot = join(projectRoot, 'docs')
  const distRoot = join(docsRoot, '.vitepress', 'dist')
  const englishGuidePaths = (await listMarkdownFiles(join(docsRoot, 'en', 'guide'))).sort()
  const frenchGuidePaths = (await listMarkdownFiles(join(docsRoot, 'guide'))).sort()
  if (JSON.stringify(englishGuidePaths) !== JSON.stringify(frenchGuidePaths)) {
    throw new Error('French and English guide page sets differ')
  }
  const expectedPaths = englishGuidePaths.map((path) => `en/guide/${path}`)
  const markdownFiles = await listMarkdownFiles(join(distRoot, 'en', 'guide'))
  const index = await readFile(join(distRoot, 'llms.txt'), 'utf8')
  const full = await readFile(join(distRoot, 'llms-full.txt'), 'utf8')
  return validateDocsArtifacts({
    index,
    full,
    markdownFiles: markdownFiles.map((path) => `en/guide/${path}`),
    expectedPaths,
  })
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = await checkDocsBuild()
  console.log(`Validated ${result.linkCount} English LLM documentation pages.`)
}
