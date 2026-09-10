---
description: Configurer les disques Factorydrive par défaut et nommés, de façon synchrone ou asynchrone.
---

# Configuration

Factorydrive reçoit un disque par défaut, une collection de disques nommés et un choix
optionnel concernant le driver local intégré.

## Contrat de configuration

```ts
interface StorageManagerConfig {
  default?: string
  disks?: Record<string, {
    driver: string
    config: unknown
  }>
  registerLocalDriver?: boolean
}
```

Chaque nom de disque appartient à l’application. Sa valeur `driver` correspond à une
clé de driver enregistrée. Le driver local est disponible sous `local`, sauf avec
`registerLocalDriver: false`.

## Plusieurs disques

```ts
FactorydriveModule.forRoot({
  default: 'documents',
  disks: {
    documents: {
      driver: 'local',
      config: { root: `${process.cwd()}/storage/documents` },
    },
    exports: {
      driver: 'local',
      config: { root: `${process.cwd()}/storage/exports` },
    },
  },
})
```

`getDisk()` sélectionne `documents`. `getDisk('exports')` est réservé au cas d’usage
qui vise explicitement les exports.

## Configuration asynchrone

```ts
FactorydriveModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    default: config.get<string>('FACTORYDRIVE_DEFAULT', 'local'),
    disks: {
      local: {
        driver: 'local',
        config: {
          root: config.get<string>('FACTORYDRIVE_LOCAL_ROOT', `${process.cwd()}/storage`),
        },
      },
    },
  }),
})
```

`forRootAsync()` accepte également `useClass` et `useExisting` via
`FactorydriveModuleAsyncOptions`.

## Enregistrer un driver externe

```ts
import { FactorydriveService } from '@ficsysfr/nestjs_module_factorydrive'
import { AwsS3Storage } from '@ficsysfr/nestjs_module_factorydrive-s3'

export class AppModule {
  public constructor(factorydrive: FactorydriveService) {
    factorydrive.registerDriver('s3', AwsS3Storage)
  }
}
```

La clé `s3` doit être identique à `disks.*.driver`. L’enregistrement intervient avant
l’initialisation des disques.
