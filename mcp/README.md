# `@ficsysfr/nestjs_module_factorydrive-mcp`

Documentation-only MCP server for the
[Factorydrive](https://ficsysfr.github.io/nestjs_module_factorydrive/) ecosystem.
It reads published documentation over HTTP; it cannot access configured disks,
credentials, or application files.

## Tools

| Tool | Description |
| --- | --- |
| `list_doc_sources` | Fetch and parse `llms.txt` |
| `search_docs` | Rank matching pages from the index and full bundle |
| `fetch_docs` | Fetch one whitelisted documentation URL |

## Configuration

```json
{
  "mcpServers": {
    "factorydrive": {
      "command": "npx",
      "args": ["-y", "@ficsysfr/nestjs_module_factorydrive-mcp"]
    }
  }
}
```

## Environment

| Variable | Default |
| --- | --- |
| `DOCS_BASE_URL` | `https://ficsysfr.github.io/nestjs_module_factorydrive` |

The production host must use HTTPS. Local previews may use HTTP on `localhost` or
`127.0.0.1`. Every requested path and redirect remains confined to the configured
documentation base path.

## Development

```bash
yarn install --frozen-lockfile
yarn test
node dist/index.js
```
