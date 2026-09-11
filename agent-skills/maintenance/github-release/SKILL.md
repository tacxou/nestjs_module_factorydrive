---
name: github-release
description: >-
  Prépare une release npm / GitHub pour nestjs_module_factorydrive : analyse les commits
  depuis le dernier tag, propose le bump SemVer (major/minor/patch), rédige les notes,
  et fournit les commandes exactes (workflow_dispatch release.yml ou gh release).
  Déclenche ce skill dès que l'utilisateur parle de release, bump de version, tag,
  changelog, publier sur npm, ou nouvelle version du module.
---

# github-release — Préparer une release Factorydrive

Ce skill prépare une release versionnée du package npm
`@ficsysfr/nestjs_module_factorydrive` et de son package MCP synchronisé, ou une
release d'un driver satellite. La publication est déclenchée par le `release.yml` du
dépôt concerné avec une version SemVer exacte `release_version=X.Y.Z`.

## Règles non négociables

- **Ne jamais** exécuter `git commit`, `git push`, `git tag`, `npm publish` ni
  `gh workflow run` / `gh release create` sans demande explicite.
- Éditer les fichiers utiles puis **afficher les commandes** à lancer.
- SemVer **stricte** `X.Y.Z` uniquement.

## Flux

1. **Préconditions** : working tree propre ; branche `main` ; `gh auth status` OK.
2. **Dernier tag** : `git describe --tags --abbrev=0` (ou historique complet si absent).
3. **Commits** : `git log <tag>..HEAD --pretty=format:"%h %s%n%b---END---"`.
4. **Classer** : breaking / feat / fix / perf / refactor / docs / interne
   (Conventional Commits + sens si préfixe absent).
5. **Proposer le bump** (`MAJOR` / `MINOR` / `PATCH`) et **demander confirmation**.
6. **Notes de release** en français, orientées utilisateur, hash courts entre parenthèses.
7. **Vérifications core + MCP** avant publication :
   ```bash
   yarn lint
   yarn typecheck
   yarn test:coverage
   yarn build
   yarn mcp:test
   yarn docs:build
   yarn docs:check
   yarn changelog:check
   yarn test:scripts
   yarn package:check
   ```
8. **Commandes à afficher** (ne pas les exécuter) :

```bash
# Option A — workflow officiel (versions synchronisées + tag + npm + GitHub Release)
gh workflow run release.yml -f release_version=X.Y.Z -f channel=latest

# Option B — si l'utilisateur préfère un bump local manuel avant
# (après édition de package.json, commit + tag laissés à l'utilisateur)
```

## Packages S3 et SFTP

Si la release concerne un dépôt sous `packages/` :

- Fournir une version SemVer exacte et maintenir le peer core compatible avec la même
  version majeure.
- Indiquer clairement quel dépôt / workflow publie ce package satellite
  (vérifier `package.json` → `repository`).
- Exécuter `yarn lint`, `yarn typecheck`, `yarn test:coverage`, `yarn build`,
  `yarn changelog:check`, `yarn test:scripts` et `yarn package:check`.

## Authentification npm

- La première publication 2.0.0 peut utiliser exceptionnellement le secret
  `NPM_TOKEN`, avec `--provenance`.
- Dès que le package existe, rattacher son Trusted Publisher au `release.yml` du bon
  dépôt, supprimer le secret et la variable `NODE_AUTH_TOKEN`, puis publier uniquement
  via GitHub OIDC.
- Ne jamais réintroduire un jeton pour contourner un échec OIDC.

## Sortie attendue

1. Résumé classé des changements depuis le dernier tag
2. Bump proposé + justification
3. Notes de release prêtes à coller
4. Commandes exactes pour l'utilisateur
