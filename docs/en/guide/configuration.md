---
description: Configure default and named Factorydrive disks synchronously or asynchronously.
---

# Configuration

Factorydrive accepts a default disk, a map of named disks, and an optional switch for
the built-in local driver.

## Configuration contract

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

Every disk name is application-defined. Its `driver` value must match a registered
driver key. Local storage is registered as `local` unless
`registerLocalDriver: false` is set.

## Multiple local disks

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

Use `getDisk()` for `documents` and `getDisk('exports')` only for the explicit export
storage use case.

## Asynchronous configuration

Keep environment access at the module boundary:

```ts
import { ConfigModule, ConfigService } from '@nestjs/config'
import { FactorydriveModule } from '@ficsysfr/nestjs_module_factorydrive'

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

`forRootAsync()` also accepts `useClass` and `useExisting` through
`FactorydriveModuleAsyncOptions`.

## Register external drivers

Register each driver during application bootstrap before disks are initialized:

```ts
import { FactorydriveService } from '@ficsysfr/nestjs_module_factorydrive'
import { AwsS3Storage } from '@ficsysfr/nestjs_module_factorydrive-s3'

export class AppModule {
  public constructor(factorydrive: FactorydriveService) {
    factorydrive.registerDriver('s3', AwsS3Storage)
  }
}
```

The registration key (`s3`) must equal the configured `disks.*.driver` value.
