---
description: Connect coding agents to Factorydrive llms.txt files and the documentation MCP server.
---

# AI agents

Factorydrive publishes English machine-readable documentation and a documentation-only
MCP server. The MCP never receives disk configuration or storage credentials.

## `llms.txt` files

| File | Role |
| --- | --- |
| [llms.txt](https://ficsysfr.github.io/nestjs_module_factorydrive/llms.txt) | Short index with links to Markdown pages |
| [llms-full.txt](https://ficsysfr.github.io/nestjs_module_factorydrive/llms-full.txt) | Full English documentation bundle |

Each English guide also has a `.md` route for targeted retrieval.

## MCP server

Run the stdio server with:

```bash
npx -y @ficsysfr/nestjs_module_factorydrive-mcp
```

It exposes:

| Tool | Role |
| --- | --- |
| `list_doc_sources` | Read and parse the `llms.txt` index |
| `search_docs` | Rank relevant pages from the index and full bundle |
| `fetch_docs` | Fetch one approved documentation URL |

## Client configuration

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

For a local documentation preview, set `DOCS_BASE_URL` to
`http://127.0.0.1:4173`. Only `ficsysfr.github.io`, `127.0.0.1`, and `localhost`
are accepted.

## Suggested workflow

1. Call `list_doc_sources` to discover available pages.
2. Call `search_docs` with the actual Factorydrive question.
3. Call `fetch_docs` on the most relevant result.
4. Answer from the retrieved API contract rather than inventing driver capabilities.
