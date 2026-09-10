---
description: Migrer les applications Factorydrive des packages @tacxou dépréciés vers @ficsysfr 2.0.0.
---

# Migration depuis `@tacxou`

Factorydrive 2.0.0 déplace tous les packages maintenus vers le scope npm `@ficsysfr`.
L’API TypeScript et le comportement du stockage restent identiques ; le changement de
nom des packages et des imports constitue la rupture majeure.

## Correspondance

| Package déprécié | Remplacement |
| --- | --- |
| `@tacxou/nestjs_module_factorydrive` | `@ficsysfr/nestjs_module_factorydrive` |
| `@tacxou/nestjs_module_factorydrive-s3` | `@ficsysfr/nestjs_module_factorydrive-s3` |
| `@tacxou/nestjs_module_factorydrive-sftp` | `@ficsysfr/nestjs_module_factorydrive-sftp` |

## Étapes

1. Désinstaller chaque package de l’ancien scope.
2. Installer le cœur 2.0.0 et les drivers nécessaires en 2.0.0 sous `@ficsysfr`.
3. Remplacer les imports dans le code, les tests, les mocks et la configuration.
4. Régénérer le lockfile avec le gestionnaire de paquets du projet.
5. Exécuter tous les tests et le build de l’application.

```ts
// Avant
import { FactorydriveService } from '@tacxou/nestjs_module_factorydrive'

// Après
import { FactorydriveService } from '@ficsysfr/nestjs_module_factorydrive'
```

Aucun package relais n’est publié. Les packages dépréciés restent installables pour les
applications historiques, mais ne reçoivent aucune version 2.x.

## Dépréciation par les mainteneurs

Exécuter ces commandes uniquement lorsque tous les remplacements publics ont été
installés et vérifiés :

```bash
npm deprecate "@tacxou/nestjs_module_factorydrive@*" "Moved to @ficsysfr/nestjs_module_factorydrive"
npm deprecate "@tacxou/nestjs_module_factorydrive-s3@*" "Moved to @ficsysfr/nestjs_module_factorydrive-s3"
npm deprecate "@tacxou/nestjs_module_factorydrive-sftp@*" "Moved to @ficsysfr/nestjs_module_factorydrive-sftp"
```

La dépréciation reste une opération manuelle du rollout et n’appartient à aucun
workflow de release.
