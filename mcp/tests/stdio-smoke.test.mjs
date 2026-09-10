import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

function fixtureServer() {
  return createServer((request, response) => {
    const origin = `http://127.0.0.1:${response.socket.localPort}`
    const pages = {
      '/llms.txt': `# Factorydrive\n\n- [Installation](${origin}/en/guide/installation.md): Install and configure Factorydrive\n`,
      '/en/guide/installation.md': '# Installation\n\nConfigure the local storage driver.',
    }
    const content = pages[request.url ?? '']
    if (content === undefined) {
      response.writeHead(404).end('not found')
      return
    }
    response.writeHead(200, { 'content-type': 'text/markdown', 'content-length': Buffer.byteLength(content) }).end(content)
  })
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => resolve(server.address()))
  })
}

function close(server) {
  return new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
}

test('the published CLI initializes and serves all documentation tools', { timeout: 15_000 }, async (context) => {
  const http = fixtureServer()
  const address = await listen(http)
  const baseUrl = `http://127.0.0.1:${address.port}`
  const child = spawn(process.execPath, [join(packageRoot, 'dist', 'index.js')], {
    cwd: packageRoot,
    env: { ...process.env, DOCS_BASE_URL: baseUrl },
    stdio: ['pipe', 'pipe', 'pipe'],
  })

  let stderr = ''
  let stdout = ''
  let nextId = 1
  const pending = new Map()

  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString()
  })
  child.stdout.on('data', (chunk) => {
    stdout += chunk.toString()
    const lines = stdout.split(/\r?\n/)
    stdout = lines.pop() ?? ''
    for (const line of lines.filter(Boolean)) {
      const message = JSON.parse(line)
      const waiter = pending.get(message.id)
      if (waiter) {
        pending.delete(message.id)
        waiter(message)
      }
    }
  })

  context.after(async () => {
    child.stdin.end()
    child.kill()
    await close(http)
  })

  function request(method, params) {
    const id = nextId
    nextId += 1
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(id)
        reject(new Error(`MCP ${method} timed out: ${stderr}`))
      }, 8_000)
      pending.set(id, (message) => {
        clearTimeout(timer)
        resolve(message)
      })
      child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', id, method, params })}\n`)
    })
  }

  const initialized = await request('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'factorydrive-smoke', version: '1.0.0' },
  })
  assert.equal(initialized.result.serverInfo.name, 'factorydrive-docs')
  child.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })}\n`)

  const listed = await request('tools/list', {})
  assert.deepEqual(listed.result.tools.map((tool) => tool.name).sort(), ['fetch_docs', 'list_doc_sources', 'search_docs'])

  const sources = await request('tools/call', { name: 'list_doc_sources', arguments: {} })
  assert.match(sources.result.content[0].text, /Parsed links: 1/)

  const searched = await request('tools/call', { name: 'search_docs', arguments: { query: 'installation' } })
  assert.match(searched.result.content[0].text, /Installation/)

  const fetched = await request('tools/call', {
    name: 'fetch_docs',
    arguments: { url: `${baseUrl}/en/guide/installation.md` },
  })
  assert.match(fetched.result.content[0].text, /local storage driver/)
})
