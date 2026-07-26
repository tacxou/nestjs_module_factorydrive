---
name: factorydrive-driver
description: >-
  Guide l'ajout ou l'extension d'un driver de stockage Factorydrive (AbstractStorage,
  enregistrement StorageManager, package satellite npm). Utiliser quand l'utilisateur
  parle de driver, disk, S3, local storage, Spaces, custom storage, ou AbstractStorage.
---

# factorydrive-driver — Ajouter / étendre un driver

## Architecture

- **Core** (`src/factorydrive/`) : `AbstractStorage`, `StorageManager`, driver `local`
- **Service Nest** : `FactorydriveService` façadise le manager
- **Module** : `FactorydriveModule.forRoot` / `forRootAsync`
- **Drivers externes** : packages `@tacxou/nestjs_module_factorydrive-*` (ex. S3)

## Nouveau driver dans un package satellite

1. Étendre `AbstractStorage` (méthodes requises : put, get, delete, exists, … —
   s'aligner sur l'existant `local-file-system.storage.ts` et `aws-s3.storage.ts`).
2. Exposer une fonction d'enregistrement du driver consommable par l'hôte
   (pattern du package S3).
3. Ne **pas** ajouter de dépendance cloud/SDK dans le package principal.
4. Peer-dépendre de `@tacxou/nestjs_module_factorydrive` (+ Nest si besoin).
5. Tests Bun dans le package driver ; documenter la config `disks` dans son README.
6. Scope de commit : `s3` (ou nouveau scope documenté dans
   `docs/conventions/conventional-commits.md` si autre driver).

## Étendre le core

- Tout export public via `src/index.ts`
- Signalier bump SemVer : nouvelle méthode sur `AbstractStorage` = souvent **MINOR**
  (ou **MAJOR** si signature breaking)
- Ajouter / adapter les tests sous `tests/`
- Vérifier : `bun test` puis `bun run build`

## Checklist

- [ ] Contrat `AbstractStorage` respecté (pas de méthode morte côté app hôte)
- [ ] Erreurs mappées vers `src/exceptions/` quand pertinent
- [ ] Config disque typée (interfaces) sans `any`
- [ ] README du package / section Usage à jour
- [ ] Tests verts + build vert
