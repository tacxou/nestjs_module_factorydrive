# Plan: Factorydrive AI documentation and FicSysFR migration

## Approche technique

1. Rename legacy package metadata and documentation to `@ficsysfr`, while
   preserving the existing public TypeScript API.
2. Add a bilingual VitePress site under `docs/`; configure the production base path
   and generate English-only LLM artifacts with `vitepress-plugin-llms`.
3. Add an independent ESM package under `mcp/` using the MCP TypeScript SDK v2 and
   stdio transport. Keep the core and MCP manifests version-aligned.
4. Add deterministic documentation parsing/search helpers and hardened URL fetching.
5. Extend CI, package auditing, Pages deployment, and exact-version release workflows.
6. Apply the matching package, import, peer dependency, documentation, CI, and release
   changes to the separate S3 and SFTP repositories.

## Contrats publics

- npm imports move to `@ficsysfr/nestjs_module_factorydrive*`.
- The MCP binary is `nestjs-module-factorydrive-mcp`.
- `DOCS_BASE_URL` defaults to the FicSysFR Pages site.
- MCP tools are `list_doc_sources`, `search_docs`, and `fetch_docs`.
- NestJS peer dependency ranges and all exported storage APIs stay unchanged.

## Risques et compatibilité

- The scope migration is breaking and requires explicit consumer import changes.
- S3 and SFTP 2.0.0 must peer-depend on core 2.0.0 and be published after it.
- GitHub Pages URLs depend on the repository transfer retaining the repository name.
- New npm packages require a one-time token-backed 2.0.0 bootstrap before Trusted
  Publishing can be attached; subsequent releases use OIDC only.
- The existing dirty Yarn/Vitest/Biome migration is preserved as the implementation base.

## Stratégie de tests

- Core: `yarn lint`, `yarn test`, `yarn build`, `yarn docs:build`.
- MCP: unit tests for parsing, search, URL policy, redirects, limits, and fallback.
- MCP smoke: initialize the built CLI, list tools, and call tools against loopback fixtures.
- Packaging: audit and install generated core/MCP tarballs in a temporary consumer.
- Drivers: run each repository's tests/build and validate the packed 2.0.0 manifest.
