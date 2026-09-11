# Instructions agents IA — NestJS Factorydrive Module

Fichier lu par Cursor Agent, Codex, Copilot Agent et assistants similaires.

`@ficsysfr/nestjs_module_factorydrive` est un **module NestJS** (bibliothèque npm) qui
abstrait le stockage fichiers (disques, drivers local / S3 / custom).

## Règles absolues

- Ne jamais exécuter `git commit`, `git push`, `git tag` ni publier une release ou
  une pull request sans demande explicite de l'utilisateur.
- Ne jamais démarrer un serveur, un watcher ou un conteneur Docker sans accord
  explicite (y compris les stacks d'exemple sous `samples/`).
- Ne pas contourner lint, tests ou hooks avec `--no-verify` ou un assouplissement
  non demandé.
- Ne pas corriger des problèmes hors du périmètre de la demande.
- Utiliser Yarn `1.22.22` et conserver `yarn.lock` comme seul lockfile.
- Utiliser Biome pour le lint et le formatage ; ne pas réintroduire ESLint ou Prettier.

## Arborescence utile

```text
src/                         # Module principal (API publique)
packages/nestjs_module_factorydrive-s3/  # Driver S3 (dépôt satellite)
packages/nestjs_module_factorydrive-sftp/ # Driver SFTP (dépôt satellite)
mcp/                         # Serveur MCP documentaire
tests/                       # Tests Vitest exécutés avec Yarn
docs/                        # Conventions et documentation agents
agent-skills/public/         # Skills distribués avec le package npm
agent-skills/maintenance/    # Workflows réservés à la maintenance du dépôt
.agents/skill-sources.json   # Racines déclarées pour les adapters locaux
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

Les skills Factorydrive ont une source unique sous [`agent-skills/`](agent-skills/) :

| Skill | Quand l'utiliser |
|-------|------------------|
| `public/use-factorydrive` | Expliquer, configurer ou intégrer Factorydrive dans une application NestJS |
| `public/factorydrive-driver` | Ajouter ou étendre un driver de stockage |
| `maintenance/github-release` | Préparer une release npm exacte core/MCP ou satellite |
| `maintenance/spec-driven` | Nouvelle feature via spec → plan → tasks (spec-kit lean) |

Les workflows génériques `commit-message`, `github-issue-comment` et
`sync-samples-patterns` sont fournis par les adapters Fysion et ne sont pas copiés dans
ce dépôt. `.agents/skills/` et `.claude/skills/` sont des destinations de liens locales,
jamais des sources versionnées.

## Workflow spec-driven (spec-kit lean)

Pour une feature non triviale :

1. Créer `specs/NNN-nom-feature/spec.md` (user stories, Given/When/Then)
2. Dériver `plan.md` puis `tasks.md`
3. Implémenter en respectant [`CLAUDE.md`](CLAUDE.md)

Voir le skill [`agent-skills/maintenance/spec-driven/SKILL.md`](agent-skills/maintenance/spec-driven/SKILL.md).

## Samples locaux

`samples/` est **git-ignoré** : références d'inspiration uniquement (module NestJS
bibliothèque, spec-kit, monorepos…). Ne jamais démarrer leurs serveurs ni
les versionner. Pour capitaliser les patterns, utiliser le workflow
`sync-samples-patterns` fourni par l'adapter local.

## Génération assistée Cursor

Commande `/commit-message` (voir `.cursor/commands/commit-message.md`).

Charte projet complète : [`CLAUDE.md`](CLAUDE.md).
