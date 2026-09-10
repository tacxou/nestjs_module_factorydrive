# Feature: Factorydrive AI documentation and FicSysFR migration

## Résumé

Factorydrive 2.0.0 migrates the core, S3, and SFTP packages to the `@ficsysfr`
scope, adds a bilingual VitePress documentation site, publishes `llms.txt` and
`llms-full.txt`, and provides a documentation-only MCP server. Existing
TypeScript symbols and storage behavior remain unchanged.

## User stories

### P1 — Consume Factorydrive documentation from an AI agent

- Given the public Factorydrive documentation is deployed
- When an MCP client starts `@ficsysfr/nestjs_module_factorydrive-mcp`
- Then it can list, search, and fetch approved documentation sources over stdio

### P1 — Discover machine-readable documentation

- Given the VitePress site is built
- When a client requests `llms.txt`, `llms-full.txt`, or a documented `.md` route
- Then it receives English, LLM-friendly documentation with canonical FicSysFR URLs

### P1 — Install the migrated ecosystem

- Given Factorydrive 2.0.0 is published
- When an application installs the core with the S3 or SFTP driver
- Then all imports and peer dependencies resolve under `@ficsysfr` without API changes

### P2 — Read the documentation as a human

- Given a French- or English-speaking developer visits the Pages site
- When they navigate the guides
- Then they can configure and use the core, local, S3, and SFTP storage APIs

## Exigences

- Publish the site at `https://ficsysfr.github.io/nestjs_module_factorydrive/`.
- Generate `llms.txt`, `llms-full.txt`, and per-page Markdown from English docs only.
- Publish `@ficsysfr/nestjs_module_factorydrive-mcp` as an ESM Node.js 22+ CLI.
- Expose `list_doc_sources`, `search_docs`, and `fetch_docs` MCP tools.
- Restrict documentation fetches to the production Pages host and loopback preview hosts.
- Keep core, MCP, S3, and SFTP package versions at `2.0.0` for the migration release.
- Keep core and MCP versions synchronized after 2.0.0.
- Preserve all current exported TypeScript symbols and runtime storage behavior.
- Prepare CI, packaging audits, Pages deployment, and release workflows.

## Hors scope

- Exposing storage read/write operations through MCP.
- Changing `AbstractStorage`, `FactorydriveService`, or driver behavior.
- Performing GitHub repository transfers, commits, pushes, tags, npm publishes, or npm deprecations.
- Editing or running git-ignored sample applications.

## Impact SemVer

MAJOR — the npm scope and every consumer import path change in 2.0.0.
