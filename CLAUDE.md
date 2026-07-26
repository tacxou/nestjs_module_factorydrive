# CLAUDE.md — Règles du projet NestJS Factorydrive Module

Ce fichier fait foi pour toute contribution de Claude Code sur ce dépôt. Les règles
ci-dessous sont **impératives** et priment sur les habitudes par défaut.

`@tacxou/nestjs_module_factorydrive` est un **module NestJS** (bibliothèque npm)
d'abstraction de stockage fichiers. Il expose `FactorydriveModule`,
`FactorydriveService`, `StorageManager`, le driver `local` et le contrat
`AbstractStorage` pour les drivers custom (ex. S3 via
`@tacxou/nestjs_module_factorydrive-s3`).

Les skills Codex / agents : [`.agents/skills/`](.agents/skills/). Les instructions
courtes multi-agents : [`AGENTS.md`](AGENTS.md).

---

## 0. Règle absolue — Git

🚫 **Claude ne doit JAMAIS `git commit` ni `git push` de lui-même.**

- Préparer les modifications (édition de fichiers), proposer un message de commit si utile,
  puis **laisser l'utilisateur committer et pousser lui-même**.
- Cette règle s'applique même si l'utilisateur a précédemment approuvé un commit : chaque
  commit/push reste une action manuelle de l'utilisateur.
- **Format des messages** : Conventional Commits 1.0.0 — voir
  `docs/conventions/conventional-commits.md` (types, scopes, exemples).
  Sujet en anglais : `type(scope): description impérative`, ≤ 72 caractères, sans point final.
- **Versionnement** : SemVer 2.0.0 **stricte** (`MAJOR.MINOR.PATCH`) — même référence ;
  signaler le bump attendu (`PATCH` / `MINOR` / `MAJOR`) quand le commit le justifie.

---

## 1. Arborescence du dépôt

```
nestjs_module_factorydrive/
├── src/                              # Code source du module (API publique)
│   ├── factorydrive.module.ts        # forRoot / forRootAsync
│   ├── factorydrive.core-module.ts
│   ├── factorydrive.service.ts       # Façade Nest injectée
│   ├── factorydrive.interfaces.ts
│   ├── factorydrive.constants.ts
│   ├── factorydrive/                 # StorageManager, AbstractStorage, local, utils
│   ├── exceptions/
│   └── index.ts                      # Barrel — tout export public passe par ici
├── packages/
│   └── nestjs_module_factorydrive-s3/  # Driver S3 (package npm satellite)
├── tests/                            # Tests Bun
├── docs/
│   └── conventions/                  # Conventional Commits, etc.
├── .agents/skills/                   # Skills agents (commit, release, drivers…)
├── .cursor/                          # Rules + commandes Cursor
├── samples/                          # Inspiration locale (git-ignoré)
├── specs/                            # Specs feature (optionnel, spec-kit lean)
├── .github/workflows/                # CI + release npm
├── package.json
├── tsconfig.json
└── README.md
```

---

## 2. Vérifications OBLIGATOIRES en fin de modification

À la fin de **toute** modification de code, avant de présenter le travail comme
terminé, lancer et faire passer au vert :

1. **Tests** :
   ```bash
   bun test
   ```
2. **Build** :
   ```bash
   bun run build
   ```

Règles : ne jamais contourner un hook ni un échec (`--no-verify` interdit). Si un
check échoue, corriger la cause racine. Une modification n'est « terminée » que lorsque
tests et build passent au vert.

Pour le package S3 (`packages/nestjs_module_factorydrive-s3/`), lancer les scripts
équivalents **dans ce package** (`bun test`, `bun run build`).

---

## 3. Règles de code (`src/` — NestJS / TypeScript)

Respecter strictement les conventions TypeScript et NestJS.

**Nommage**
- Fonctions / méthodes / variables : `camelCase`
- Classes / décorateurs / types / interfaces : `PascalCase`
- Fichiers : `kebab-case` avec préfixe de domaine `factorydrive.*` :
  `factorydrive.module.ts`, `factorydrive.service.ts`, etc.
- Drivers sous `src/factorydrive/` : `*.storage.ts` (ex. `local-file-system.storage.ts`)

**API publique**
- Tout symbole exporté consommable par les applications hôtes doit passer par `src/index.ts`.
- Ne pas casser la compatibilité `peerDependencies` (`@nestjs/common`, `@nestjs/core`)
  sans signaler un bump **MAJOR**.

**Style**
- TypeScript strict sur les API publiques, pas de `any` implicite.
- Injection de dépendances Nest, un fichier = une responsabilité.
- **Imports** : classes injectées et symboles Nest en **import valeur** (DI + `emitDecoratorMetadata`) ;
  `import type` pour les types purs sans métadonnées runtime. Voir `.cursor/rules/nestjs-library-imports.mdc`.

**Stockage**
- `StorageManager` enregistre les drivers et résout les disques nommés.
- Tout nouveau driver étend `AbstractStorage` et s'enregistre via le manager.
- Le driver `local` vit dans le package principal ; S3 et autres drivers dans des
  packages satellites (`@tacxou/nestjs_module_factorydrive-*`).
- Voir le skill `.agents/skills/factorydrive-driver/SKILL.md`.

---

## 4. Package S3 (`packages/nestjs_module_factorydrive-s3/`)

- Package npm distinct, peer sur `@tacxou/nestjs_module_factorydrive`.
- Même discipline SemVer / Conventional Commits (scope `s3`).
- Ne pas coupler le core à AWS SDK : le core reste agnostique.

---

## 5. Samples et Docker

- `samples/` : lecture seule pour inspiration (module LDAP, spec-kit, monorepos).
- Ne pas installer leurs deps ni démarrer leurs services sauf demande explicite.
- Patterns Docker / monorepo Turbo : s'inspirer de monorepos **sans** copier l'identité
  du projet source (voir skill `sync-samples-patterns`).

---

## 6. Publication

- Publication npm déclenchée par le workflow `.github/workflows/release.yml`
  (`workflow_dispatch` avec bump major/minor/patch).
- Le champ `version` de `package.json` doit rester aligné avec le tag SemVer `vX.Y.Z`.
- Le script `postbuild` génère les `.d.ts` et copie `README.md`, `LICENSE`, `package.json` dans `dist/`.
- Préparation assistée : skill `.agents/skills/github-release/SKILL.md`.
