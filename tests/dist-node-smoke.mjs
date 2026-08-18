#!/usr/bin/env node
/**
 * Smoke test exécuté par Node contre le `dist/` bâti (pas par Bun, pas contre `src/`).
 *
 * Raison d'être : `dist/index.js` est produit par `bun build`, qui émet de la syntaxe
 * ESM, sans que `package.json` déclare `"type": "module"`. Node détecte la syntaxe et
 * charge donc le paquet en ESM — un contexte où `import * as ns from '<paquet-cjs>'`
 * peut silencieusement manquer des exports que `cjs-module-lexer` ne détecte pas
 * statiquement (cf. `fs-extra`, dont les exports sont assemblés par des `require()`
 * étalés). `bun test` ne reproduit PAS ce bug : le runtime Bun résout ces imports
 * correctement quel que soit le mode de résolution déclaré. Seul `node` exécutant le
 * `dist` réel — le chemin de prod — peut l'attraper.
 *
 * Couvre toutes les méthodes de `LocalFileSystemStorage` qui délèguent à `fse` :
 * put (Buffer + stream), get, getBuffer, getStat, getStream, append, exists, delete.
 */
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { Readable } from 'node:stream'

// URL (pas un chemin fs brut) : import() exige file:// pour un chemin absolu sous Windows.
const distIndexUrl = new URL('../dist/index.js', import.meta.url)
const { StorageManager } = await import(distIndexUrl)

const root = await mkdtemp(join(tmpdir(), 'factorydrive-smoke-'))
let failures = 0

const step = async (name, fn) => {
  try {
    await fn()
    console.log(`ok - ${name}`)
  } catch (error) {
    failures++
    console.error(`not ok - ${name}`)
    console.error(error)
  }
}

try {
  const manager = new StorageManager({
    default: 'local',
    disks: { local: { driver: 'local', config: { root } } },
  })
  const disk = manager.disk('local')

  await step('put(Buffer) écrit le fichier', async () => {
    await disk.put('smoke/buffer.txt', Buffer.from('hello-buffer'))
  })

  await step('getBuffer relit le contenu binaire', async () => {
    const { content } = await disk.getBuffer('smoke/buffer.txt')
    assert.equal(content.toString(), 'hello-buffer')
  })

  await step('get relit le contenu texte', async () => {
    const { content } = await disk.get('smoke/buffer.txt', 'utf-8')
    assert.equal(content, 'hello-buffer')
  })

  await step('getStat rapporte une taille cohérente', async () => {
    const stat = await disk.getStat('smoke/buffer.txt')
    assert.equal(stat.size, Buffer.byteLength('hello-buffer'))
  })

  await step('append concatène', async () => {
    await disk.append('smoke/buffer.txt', '-appended')
    const { content } = await disk.get('smoke/buffer.txt', 'utf-8')
    assert.equal(content, 'hello-buffer-appended')
  })

  await step('exists reflète la présence du fichier', async () => {
    const { exists } = await disk.exists('smoke/buffer.txt')
    assert.equal(exists, true)
  })

  await step('put(stream) écrit via un flux', async () => {
    await disk.put('smoke/stream.txt', Readable.from(['hello-', 'stream']))
  })

  await step('getStream relit via un flux', async () => {
    const readable = await disk.getStream('smoke/stream.txt')
    const chunks = []
    for await (const chunk of readable) chunks.push(chunk)
    assert.equal(Buffer.concat(chunks).toString(), 'hello-stream')
  })

  await step('delete supprime le fichier', async () => {
    await disk.delete('smoke/buffer.txt')
    const { exists } = await disk.exists('smoke/buffer.txt')
    assert.equal(exists, false)
  })
} finally {
  await rm(root, { recursive: true, force: true })
}

if (failures > 0) {
  console.error(`\n${failures} étape(s) en échec`)
  process.exit(1)
}
console.log('\nToutes les étapes sont passées.')
