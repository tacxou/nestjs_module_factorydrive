import assert from 'node:assert/strict'
import test from 'node:test'
import { assertAllowedDocsUrl, fetchText, MAX_DOC_BYTES, parseLlmsFull, parseLlmsIndex, searchDocsContent } from '../dist/docs-client.js'

const productionBase = 'https://ficsysfr.github.io/nestjs_module_factorydrive'

test('parseLlmsIndex resolves links and notes', () => {
  const links = parseLlmsIndex('# Factorydrive\n\n- [Installation](/nestjs_module_factorydrive/en/guide/installation.md): Install the core\n', productionBase)

  assert.deepEqual(links, [
    {
      title: 'Installation',
      url: 'https://ficsysfr.github.io/nestjs_module_factorydrive/en/guide/installation.md',
      notes: 'Install the core',
    },
  ])
})

test('parseLlmsFull separates pages and extracts headings', () => {
  const pages = parseLlmsFull(`---
url: >-
  ${productionBase}/en/guide/installation.md
description: Installation overview
---
# Installation

Install the core.

---
url: ${productionBase}/en/guide/drivers.md
---
# Drivers

Compare local storage and S3.`)

  assert.equal(pages.length, 2)
  assert.equal(pages[0].title, 'Installation')
  assert.match(pages[1].content, /local storage and S3/)
})

test('searchDocsContent ranks page-specific content and enforces the limit', () => {
  const links = [
    { title: 'Installation', url: `${productionBase}/en/guide/installation.md` },
    { title: 'Drivers', url: `${productionBase}/en/guide/drivers.md`, notes: 'Local, S3, and SFTP' },
  ]
  const full = `---
url: ${links[0].url}
---
# Installation

Install the NestJS module.

---
url: ${links[1].url}
---
# Drivers

SFTP connects during storage initialization.`

  const [result] = searchDocsContent('SFTP initialization', links, full, 1)
  assert.equal(result.title, 'Drivers')
  assert.match(result.snippet, /SFTP connects/)
  assert.equal(searchDocsContent('storage', links, full, 1).length, 1)
  assert.equal(searchDocsContent('', links, undefined, 1).length, 1)
  const manyLinks = Array.from({ length: 35 }, (_, index) => ({
    title: `Storage ${index}`,
    url: `${productionBase}/en/guide/storage-${index}.md`,
  }))
  assert.equal(searchDocsContent('storage', manyLinks, undefined, 99).length, 30)
  assert.equal(searchDocsContent('storage', manyLinks, undefined, 0).length, 1)
})

test('assertAllowedDocsUrl confines hosts, protocols, origins, and paths', () => {
  assert.equal(assertAllowedDocsUrl(`${productionBase}/en/guide/installation.md`, productionBase).href, `${productionBase}/en/guide/installation.md`)
  assert.throws(() => assertAllowedDocsUrl('http://ficsysfr.github.io/nestjs_module_factorydrive/llms.txt', productionBase), /requires HTTPS/)
  assert.throws(() => assertAllowedDocsUrl('https://example.com/llms.txt', productionBase), /host not allowed/)
  assert.throws(() => assertAllowedDocsUrl('https://ficsysfr.github.io/other/llms.txt', productionBase), /outside the configured base/)
  assert.throws(() => assertAllowedDocsUrl(`${productionBase}/en/guide/index.html`, productionBase), /not an allowed/)
  assert.throws(() => assertAllowedDocsUrl(`${productionBase}/en%2Fguide/secret.md`, productionBase), /encoded path separators/)
  assert.throws(() => assertAllowedDocsUrl(`https://user:secret@ficsysfr.github.io/nestjs_module_factorydrive/llms.txt`, productionBase), /credentials/)
  assert.throws(() => assertAllowedDocsUrl('http://localhost:9999/llms.txt', 'http://localhost:4173'), /configured origin/)
  assert.equal(assertAllowedDocsUrl('http://127.0.0.1:4173/llms.txt', 'http://127.0.0.1:4173').pathname, '/llms.txt')
})

test('fetchText follows only approved redirects', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => {
    globalThis.fetch = originalFetch
  })

  globalThis.fetch = async () => new Response(null, { status: 302, headers: { location: 'https://example.com/secret' } })
  await assert.rejects(() => fetchText(`${productionBase}/redirect.md`, productionBase), /host not allowed/)

  globalThis.fetch = async () => new Response(null, { status: 302, headers: { location: '/other/secret.md' } })
  await assert.rejects(() => fetchText(`${productionBase}/redirect.md`, productionBase), /outside the configured base/)
})

test('fetchText rejects oversized responses and accepts bounded text', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => {
    globalThis.fetch = originalFetch
  })

  globalThis.fetch = async () => new Response('small documentation')
  assert.equal(await fetchText(`${productionBase}/small.md`, productionBase), 'small documentation')

  globalThis.fetch = async () => new Response('x', { headers: { 'content-length': String(MAX_DOC_BYTES + 1) } })
  await assert.rejects(() => fetchText(`${productionBase}/large.md`, productionBase), /exceeds/)

  globalThis.fetch = async () => new Response('not found', { status: 404 })
  await assert.rejects(() => fetchText(`${productionBase}/missing.md`, productionBase), /HTTP 404/)
})
