# Factorydrive configuration

Use these patterns for the current Factorydrive API. Confirm them against the version
installed in the consuming application before editing it.

## Contents

- [Install packages](#install-packages)
- [Configure the built-in local driver](#configure-the-built-in-local-driver)
- [Configure asynchronously](#configure-asynchronously)
- [Configure multiple disks](#configure-multiple-disks)
- [Register the S3 driver](#register-the-s3-driver)
- [Register the SFTP driver](#register-the-sftp-driver)

## Install packages

Install the core package for every setup:

```bash
yarn add @ficsysfr/nestjs_module_factorydrive
```

Install a maintained satellite driver only when required:

```bash
yarn add @ficsysfr/nestjs_module_factorydrive-s3
yarn add @ficsysfr/nestjs_module_factorydrive-sftp
```

Use Yarn for the commands shown by this skill. If the consuming repository explicitly
standardizes on another package manager, preserve that repository's convention.

## Configure the built-in local driver

```ts
import { Module } from '@nestjs/common'
import { FactorydriveModule } from '@ficsysfr/nestjs_module_factorydrive'

@Module({
  imports: [
    FactorydriveModule.forRoot({
      default: 'local',
      disks: {
        local: {
          driver: 'local',
          config: {
            root: `${process.cwd()}/storage`,
          },
        },
      },
    }),
  ],
})
export class AppModule {}
```

The local driver is registered by default. Set `registerLocalDriver: false` only when
the application deliberately replaces or excludes it.

## Configure asynchronously

Keep environment access in module configuration rather than business services:

```ts
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { FactorydriveModule } from '@ficsysfr/nestjs_module_factorydrive'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    }),
  ],
})
export class AppModule {}
```

`forRootAsync()` also supports an options factory class through `useClass`. Check the
installed `FactorydriveModuleAsyncOptions` type before choosing less common NestJS
provider patterns.

## Configure multiple disks

Disk names are application-level identifiers. Driver names select implementations:

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

## Register the S3 driver

The external driver key must be registered before Factorydrive initializes its disks:

```ts
import { Module } from '@nestjs/common'
import {
  FactorydriveModule,
  FactorydriveService,
} from '@ficsysfr/nestjs_module_factorydrive'
import { AwsS3Storage } from '@ficsysfr/nestjs_module_factorydrive-s3'

@Module({
  imports: [
    FactorydriveModule.forRoot({
      default: 'files',
      disks: {
        files: {
          driver: 's3',
          config: {
            bucket: process.env.S3_BUCKET!,
            region: process.env.S3_REGION!,
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID!,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
            },
          },
        },
      },
    }),
  ],
})
export class AppModule {
  public constructor(factorydrive: FactorydriveService) {
    factorydrive.registerDriver('s3', AwsS3Storage)
  }
}
```

The S3 configuration extends AWS SDK v3 `S3ClientConfig` and requires `bucket`. Supply
an `endpoint` and other standard client options for S3-compatible providers when needed.

## Register the SFTP driver

```ts
import { Module } from '@nestjs/common'
import {
  FactorydriveModule,
  FactorydriveService,
} from '@ficsysfr/nestjs_module_factorydrive'
import { SFTPStorage } from '@ficsysfr/nestjs_module_factorydrive-sftp'

@Module({
  imports: [
    FactorydriveModule.forRoot({
      default: 'files',
      disks: {
        files: {
          driver: 'sftp',
          config: {
            root: '/var/www/storage',
            options: {
              host: process.env.SFTP_HOST!,
              port: 22,
              username: process.env.SFTP_USERNAME!,
              password: process.env.SFTP_PASSWORD!,
            },
          },
        },
      },
    }),
  ],
})
export class AppModule {
  public constructor(factorydrive: FactorydriveService) {
    factorydrive.registerDriver('sftp', SFTPStorage)
  }
}
```

The SFTP driver configuration contains a remote `root` plus `ssh2-sftp-client`
`ConnectOptions`. Prefer key-based authentication when the consuming application's
deployment environment supports it.

Do not use obsolete examples that call `createDisk()` or `disk()`. The current service
API registers drivers with `registerDriver()` and resolves disks with `getDisk()`.
