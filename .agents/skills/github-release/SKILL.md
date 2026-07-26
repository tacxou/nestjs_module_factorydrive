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
`@tacxou/nestjs_module_factorydrive` (et éventuellement du driver S3).
La publication est déclenchée par `.github/workflows/release.yml`
(`workflow_dispatch` avec `version_increment`).

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
7. **Vérifications** avant publication :
   ```bash
   bun test
   bun run build
   ```
8. **Commandes à afficher** (ne pas les exécuter) :

```bash
# Option A — workflow officiel (bump + tag + npm publish + GitHub Release)
gh workflow run release.yml -f version_increment=patch   # ou minor / major

# Option B — si l'utilisateur préfère un bump local manuel avant
# (après édition de package.json, commit + tag laissés à l'utilisateur)
```

## Package S3

Si la release concerne `packages/nestjs_module_factorydrive-s3/` :

- Traiter sa version SemVer **séparément** (`package.json` du package).
- Indiquer clairement quel dépôt / workflow publie ce package satellite
  (souvent un dépôt npm distinct — vérifier `package.json` → `repository`).

## Sortie attendue

1. Résumé classé des changements depuis le dernier tag
2. Bump proposé + justification
3. Notes de release prêtes à coller
4. Commandes exactes pour l'utilisateur
