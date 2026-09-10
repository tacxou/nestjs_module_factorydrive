# Changelog

All notable changes to Factorydrive are documented here.

## 2.0.0 - 2026-09-09

### Nouveautés

- Publication du cœur sous `@ficsysfr/nestjs_module_factorydrive` et ajout du serveur documentaire `@ficsysfr/nestjs_module_factorydrive-mcp`.
- Documentation VitePress bilingue, corpus `llms.txt`/`llms-full.txt` et outils MCP sécurisés pour la consulter.

### Qualité et distribution

- Migration du cœur vers Yarn, Biome et Vitest avec typecheck et seuils de couverture bloquants.
- Tarballs npm audités, empreintes SHA-256 reproductibles et tests d’installation réels.
- Release manuelle idempotente avec provenance npm, canaux `latest`/`next` et préparation à Trusted Publishing/OIDC.

### Migration

- Les imports applicatifs passent du scope historique `@tacxou` au scope `@ficsysfr` sans modification de l’API Factorydrive.
