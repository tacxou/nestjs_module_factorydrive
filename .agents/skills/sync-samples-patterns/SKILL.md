---
name: sync-samples-patterns
description: >-
  Relit le dossier samples/ (références locales git-ignorées) et met à jour la
  bibliothèque de fiches de patterns anonymisées dans docs/references-patterns/.
  Utiliser quand l'utilisateur parle de relire les samples, rescanner samples,
  mettre à jour les patterns, ou a ajouté un projet dans samples/.
---

# sync-samples-patterns — Relire `samples/` et actualiser les fiches

Maintient `docs/references-patterns/` à partir des projets dans `samples/`.
Objectif : disposer de patrons techniques réutilisables **sans** divulguer
l'identité des projets sources.

## Règles non négociables

- 🔒 **Anonymisation** : ne jamais écrire le nom d'un dossier de `samples/`, d'un
  scope npm privé, d'une URL de dépôt ou d'une société dans une fiche.
- 🚫 Pas de `git commit` / `git push`.
- 🚫 Ne jamais démarrer un serveur ni installer les dépendances des samples.
- `samples/` est git-ignoré ; seul `docs/references-patterns/` est versionné.

## Flux

1. Inventorier `samples/` et les fiches existantes.
2. Pour chaque projet : nature + patterns (lecture ciblée de `package.json`,
   `README.md`, arborescence clés).
3. Créer / actualiser les fiches anonymisées + `docs/references-patterns/README.md`.
4. Grep d'anonymisation (noms des dossiers `samples/` + scopes repérés) → 0 match.

## Patterns typiques à chercher (Factorydrive)

| Signal | Fiche suggérée |
|--------|----------------|
| Module NestJS bibliothèque (`forRoot` / `forRootAsync`, barrel `index.ts`) | `00-module-nestjs-bibliotheque.md` |
| Spec-driven / templates specify / `specs/` | `01-spec-driven-lean.md` |
| Monorepo Turbo + Docker / pilot containers | `02-monorepo-docker-tooling.md` |
| Driver / plugin package satellite | `03-driver-package-satellite.md` |
| Base agents (`AGENTS.md`, `.agents/skills`) | `04-base-agents-skills.md` |

Si un pattern nouveau apparaît, créer `0N-<slug>.md` et l'ajouter à l'index.

## Style des fiches

Français. Sections : **Quand l'utiliser**, **Stack de référence**, **Structure**,
**Pièges**, **À retenir pour Factorydrive**. Toujours raccrocher aux conventions
du dépôt (`src/index.ts`, SemVer, Bun, drivers via `AbstractStorage`).
