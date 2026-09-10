import { spawnSync } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const projectRoot = resolve(import.meta.dirname, '..')
const packages = [
  {
    name: '@ficsysfr/nestjs_module_factorydrive',
    root: projectRoot,
    artifacts: join(projectRoot, '.artifacts', 'npm'),
  },
  {
    name: '@ficsysfr/nestjs_module_factorydrive-mcp',
    root: join(projectRoot, 'mcp'),
    artifacts: join(projectRoot, '.artifacts', 'npm'),
  },
  {
    name: '@ficsysfr/nestjs_module_factorydrive-s3',
    root: join(projectRoot, 'packages', 'nestjs_module_factorydrive-s3'),
    artifacts: join(projectRoot, 'packages', 'nestjs_module_factorydrive-s3', '.artifacts', 'npm'),
  },
  {
    name: '@ficsysfr/nestjs_module_factorydrive-sftp',
    root: join(projectRoot, 'packages', 'nestjs_module_factorydrive-sftp'),
    artifacts: join(projectRoot, 'packages', 'nestjs_module_factorydrive-sftp', '.artifacts', 'npm'),
  },
]

function run(command, args, cwd) {
  let resolvedCommand = command
  if (process.platform === 'win32' && command === 'npm') {
    const lookup = spawnSync('where.exe', ['npm.cmd'], { cwd, encoding: 'utf8' })
    resolvedCommand = lookup.stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) ?? 'npm.cmd'
  }
  const windowsCommand = [resolvedCommand, ...args].map((value) => `"${value.replaceAll('"', '""')}"`).join(' ')
  const result = process.platform === 'win32' ? spawnSync(windowsCommand, { cwd, encoding: 'utf8', shell: true }) : spawnSync(command, args, { cwd, encoding: 'utf8' })
  if (result.status !== 0) throw new Error(`${command} failed\n${result.stdout ?? ''}${result.stderr ?? ''}`)
  return result.stdout.trim()
}

const manifests = await Promise.all(packages.map(({ root }) => readFile(join(root, 'package.json'), 'utf8').then(JSON.parse)))
const versions = new Set(manifests.map((manifest) => manifest.version))
if (versions.size !== 1) throw new Error(`Package versions are not synchronized: ${[...versions].join(', ')}`)
const version = manifests[0].version

const tarballs = packages.map(({ name, artifacts }) => {
  const filename = `${name.slice(1).replace('/', '-')}-${version}.tgz`
  return join(artifacts, filename)
})

const temporaryRoot = await mkdtemp(join(tmpdir(), 'factorydrive-ecosystem-audit-'))
try {
  await writeFile(join(temporaryRoot, 'package.json'), '{"name":"factorydrive-ecosystem-audit","private":true,"type":"module"}')
  run(
    'npm',
    ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--legacy-peer-deps', ...tarballs, '@nestjs/common@11', '@nestjs/core@11', 'reflect-metadata@0.2', 'rxjs@7'],
    temporaryRoot,
  )

  const smoke = `
    import * as core from '@ficsysfr/nestjs_module_factorydrive'
    import * as s3 from '@ficsysfr/nestjs_module_factorydrive-s3'
    import * as sftp from '@ficsysfr/nestjs_module_factorydrive-sftp'
    import { createRequire } from 'node:module'
    import { readFileSync } from 'node:fs'
    import { dirname, join } from 'node:path'
    const require = createRequire(import.meta.url)
    if (typeof core.FactorydriveService !== 'function') throw new Error('Core export missing')
    if (typeof s3.AwsS3Storage !== 'function') throw new Error('S3 export missing')
    if (typeof sftp.SFTPStorage !== 'function') throw new Error('SFTP export missing')
    const manifestPath = require.resolve('@ficsysfr/nestjs_module_factorydrive-mcp/package.json')
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    const binary = join(dirname(manifestPath), manifest.bin['nestjs-module-factorydrive-mcp'])
    if (!readFileSync(binary, 'utf8').startsWith('#!/usr/bin/env node')) throw new Error('MCP binary is invalid')
  `
  run(process.execPath, ['--input-type=module', '--eval', smoke], temporaryRoot)
} finally {
  await rm(temporaryRoot, { recursive: true, force: true })
}

console.log(`Installed and imported all four Factorydrive ${version} tarballs.`)
