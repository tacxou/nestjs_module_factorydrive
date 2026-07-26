# Instructions agents IA — NestJS Factorydrive Module

Fichier lu par Cursor Agent, Codex, Copilot Agent et assistants similaires.

`@tacxou/nestjs_module_factorydrive` est un **module NestJS** (bibliothèque npm) qui
abstrait le stockage fichiers (disques, drivers local / S3 / custom).

## Règles absolues

- Ne jamais exécuter `git commit`, `git push`, `git tag` ni publier une release ou
  une pull request sans demande explicite de l'utilisateur.
- Ne jamais démarrer un serveur, un watcher ou un conteneur Docker sans accord
  explicite (y compris les stacks d'exemple sous `samples/`).
- Ne pas contourner lint, tests ou hooks avec `--no-verify` ou un assouplissement
  non demandé.
- Ne pas corriger des problèmes hors du périmètre de la demande.

## Arborescence utile

```text
src/                         # Module principal (API publique)
packages/nestjs_module_factorydrive-s3/  # Driver S3 (package satellite)
tests/                       # Tests Bun
docs/                        # Conventions et documentation agents
.agents/skills/              # Skills réutilisables (source de vérité)
.cursor/                     # Rules + commandes Cursor
samples/                     # Références locales git-ignorées (inspiration)
specs/                       # Specs feature (workflow spec-kit lean, optionnel)
```

## Messages de commit

Suivre **Conventional Commits 1.0.0** — spécification complète :
[`docs/conventions/conventional-commits.md`](docs/conventions/conventional-commits.md)

Résumé :

```
<type>(<scope>): <description>
```

- Anglais, impératif, sujet ≤ 72 caractères, sans point final.
- Types : `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- Scopes : `src`, `tests`, `s3`, `deps`, `ci`, `root`.
- Proposer le message ; ne pas `git commit` / `git push` sans demande explicite.

## Versionnement

**SemVer 2.0.0 stricte** : format `X.Y.Z` ; `fix` → PATCH, `feat` → MINOR, breaking → MAJOR.

## Skills

Les workflows réutilisables vivent dans [`.agents/skills/`](.agents/skills/) :

| Skill | Quand l'utiliser |
|-------|------------------|
| `commit-message` | Générer un message Conventional Commits + bump SemVer |
| `github-issue-comment` | Brouillon de commentaire d'issue dans `.issues/{n}.md` |
| `github-release` | Préparer une release npm (bump, notes, commandes) |
| `sync-samples-patterns` | Extraire des patterns anonymisés depuis `samples/` |
| `spec-driven` | Nouvelle feature via spec → plan → tasks (spec-kit lean) |
| `factorydrive-driver` | Ajouter ou étendre un driver de stockage |

## Workflow spec-driven (spec-kit lean)

Pour une feature non triviale :

1. Créer `specs/NNN-nom-feature/spec.md` (user stories, Given/When/Then)
2. Dériver `plan.md` puis `tasks.md`
3. Implémenter en respectant [`CLAUDE.md`](CLAUDE.md)

Voir le skill [`.agents/skills/spec-driven/SKILL.md`](.agents/skills/spec-driven/SKILL.md).

## Samples locaux

`samples/` est **git-ignoré** : références d'inspiration uniquement (module NestJS
bibliothèque, spec-kit, monorepos…). Ne jamais démarrer leurs serveurs ni
les versionner. Pour capitaliser les patterns : skill `sync-samples-patterns`.

## Génération assistée Cursor

Commande `/commit-message` (voir `.cursor/commands/commit-message.md`).

Charte projet complète : [`CLAUDE.md`](CLAUDE.md).
