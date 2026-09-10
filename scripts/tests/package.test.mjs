import assert from 'node:assert/strict'
import test from 'node:test'
import { parsePackOutput, validateManifestPair, validatePackMetadata } from '../package.mjs'

test('parsePackOutput supports npm 11 arrays and npm 12 maps', () => {
  const report = { name: '@ficsysfr/nestjs_module_factorydrive', version: '2.0.0' }
  assert.deepEqual(parsePackOutput(JSON.stringify([report])), report)
  assert.deepEqual(parsePackOutput(JSON.stringify(report)), report)
  assert.deepEqual(parsePackOutput(JSON.stringify({ [report.name]: report })), report)
})

test('parsePackOutput rejects invalid or ambiguous reports', () => {
  for (const value of [[], [{}, {}], {}, { one: {}, two: {} }, null, 'report', 1, [[]]]) {
    assert.throws(() => parsePackOutput(JSON.stringify(value)), /unexpected report/)
  }
})

test('validateManifestPair requires synchronized versions and the MCP binary', () => {
  const publication = {
    repository: 'https://github.com/FicSysFR/nestjs_module_factorydrive.git',
    bugs: { url: 'https://github.com/FicSysFR/nestjs_module_factorydrive/issues' },
    publishConfig: { access: 'public', registry: 'https://registry.npmjs.org/' },
  }
  assert.doesNotThrow(() =>
    validateManifestPair(
      { name: '@ficsysfr/nestjs_module_factorydrive', version: '2.0.0', homepage: 'https://ficsysfr.github.io/nestjs_module_factorydrive/', ...publication },
      {
        name: '@ficsysfr/nestjs_module_factorydrive-mcp',
        version: '2.0.0',
        homepage: 'https://ficsysfr.github.io/nestjs_module_factorydrive/en/guide/ai',
        ...publication,
        bin: { 'nestjs-module-factorydrive-mcp': './dist/index.js' },
        engines: { node: '>=22.0.0' },
      },
    ),
  )
  assert.throws(
    () =>
      validateManifestPair(
        { name: '@ficsysfr/nestjs_module_factorydrive', version: '2.0.0', homepage: 'https://ficsysfr.github.io/nestjs_module_factorydrive/', ...publication },
        {
          name: '@ficsysfr/nestjs_module_factorydrive-mcp',
          version: '2.0.1',
          homepage: 'https://ficsysfr.github.io/nestjs_module_factorydrive/en/guide/ai',
          ...publication,
          bin: { 'nestjs-module-factorydrive-mcp': './dist/index.js' },
          engines: { node: '>=22.0.0' },
        },
      ),
    /versions differ/,
  )
  assert.throws(
    () =>
      validateManifestPair(
        { name: '@ficsysfr/nestjs_module_factorydrive', version: '2.0.0', homepage: 'https://example.invalid/', ...publication },
        {
          name: '@ficsysfr/nestjs_module_factorydrive-mcp',
          version: '2.0.0',
          homepage: 'https://ficsysfr.github.io/nestjs_module_factorydrive/en/guide/ai',
          ...publication,
          bin: { 'nestjs-module-factorydrive-mcp': './dist/index.js' },
          engines: { node: '>=22.0.0' },
        },
      ),
    /canonical URLs/,
  )
})

test('validatePackMetadata rejects source files', () => {
  assert.throws(
    () =>
      validatePackMetadata({
        name: '@ficsysfr/nestjs_module_factorydrive',
        size: 100,
        files: [{ path: 'LICENSE' }, { path: 'README.md' }, { path: 'dist/index.d.ts' }, { path: 'dist/index.js' }, { path: 'package.json' }, { path: 'src/index.ts' }],
      }),
    /forbidden path/,
  )
})

test('validatePackMetadata rejects files outside the strict allowlist', () => {
  assert.throws(
    () =>
      validatePackMetadata({
        name: '@ficsysfr/nestjs_module_factorydrive',
        size: 100,
        files: [{ path: 'LICENSE' }, { path: 'README.md' }, { path: 'dist/index.d.ts' }, { path: 'dist/index.js' }, { path: 'package.json' }, { path: 'notes.txt' }],
      }),
    /non-allowlisted path/,
  )
})
