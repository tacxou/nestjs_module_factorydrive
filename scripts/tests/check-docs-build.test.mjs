import assert from 'node:assert/strict'
import test from 'node:test'
import { validateDocsArtifacts } from '../check-docs-build.mjs'

const path = 'en/guide/installation.md'
const url = `https://ficsysfr.github.io/nestjs_module_factorydrive/${path}`

test('validateDocsArtifacts accepts an English-only generated corpus', () => {
  const result = validateDocsArtifacts({
    index: `- [Installation](${url}): Install Factorydrive.`,
    full: `---\nurl: ${url}\n---\n# Installation`,
    markdownFiles: [path],
    expectedPaths: [path],
  })
  assert.equal(result.linkCount, 1)
})

test('validateDocsArtifacts rejects off-prefix and internal documentation', () => {
  assert.throws(
    () =>
      validateDocsArtifacts({
        index: '- [Internal](https://ficsysfr.github.io/nestjs_module_factorydrive/guide/internal.md)',
        full: 'CLAUDE.md',
        markdownFiles: ['guide/internal.md'],
        expectedPaths: ['guide/internal.md'],
      }),
    /non-English or off-site/,
  )
})
