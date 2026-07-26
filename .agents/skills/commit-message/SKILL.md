---
name: commit-message
description: >-
  Génère un message Conventional Commits conforme à Factorydrive à partir des seuls
  fichiers Git stagés. Utiliser quand l'utilisateur demande un message de commit,
  une commande git commit prête à copier, ou l'analyse du bump SemVer associé.
---

# Générer un message de commit Factorydrive

## Procédure

1. Lire uniquement `git status --short` et `git diff --cached`.
2. Si aucun changement n'est stagé, le signaler et s'arrêter.
3. Identifier l'intention principale et le périmètre dominant.
4. Vérifier `docs/conventions/conventional-commits.md`.
5. Produire le message, le bump SemVer éventuel et une commande prête à copier.

## Format

```text
type(scope): imperative description in English
```

- Types : `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`,
  `ci`, `chore`, `revert`.
- Scopes : `src`, `tests`, `s3`, `deps`, `ci`, `root`.
  Ne jamais inventer `storage`, `driver`, `github` ou `config`.
- Sujet anglais, impératif, minuscule après `:`, sans point final, 72 caractères maximum.
- Breaking change : `type(scope)!:` ou pied `BREAKING CHANGE:`.
- SemVer : `fix` = PATCH, `feat` = MINOR, breaking = MAJOR ; sinon aucun bump.
  Signaler le package touché (`@tacxou/nestjs_module_factorydrive` et/ou `-s3`).

## Sortie attendue

1. **Message** — sujet et corps optionnel si le pourquoi n'est pas évident.
2. **Bump SemVer** — par package touché, uniquement si applicable.
3. **Commande** — `git commit -m "type(scope): description"` prête à copier.

Ne jamais exécuter `git commit` ni `git push`, sauf demande explicite distincte.
