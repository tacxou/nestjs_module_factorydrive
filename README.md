<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  Factory drive module for NestJS framework
</p>

<p align="center">
  <a href="https://www.npmjs.com/org/tacxou"><img src="https://img.shields.io/npm/v/@tacxou/nestjs_module_factorydrive.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/org/tacxou"><img src="https://img.shields.io/npm/l/@tacxou/nestjs_module_factorydrive.svg" alt="Package License" /></a>
  <a href="https://github.com/tacxou/nestjs_module_rcon/actions/workflows/ci.yml"><img src="https://github.com/tacxou/nestjs_module_factorydrive/actions/workflows/ci.yml/badge.svg" alt="Publish Package to npmjs" /></a>
  <a href="https://codecov.io/gh/tacxou/nestjs_module_factorydrive"><img src="https://codecov.io/gh/tacxou/nestjs_module_factorydrive/graph/badge.svg?token=BX1NdAZ9yj"/></a>
  <a href="https://github.com/tacxou/nestjs_module_rcon/actions/workflows/release.yml?event=workflow_dispatch"><img alt="GitHub contributors" src="https://github.com/tacxou/nestjs_module_rcon/actions/workflows/release.yml/badge.svg"></a>
</p>
<br>

## `@tacxou/nestjs_module_factorydrive`

`nestjs_module_factorydrive` provides a simple storage abstraction for NestJS:
- configure one or many disks
- select a default disk
- use built-in local filesystem driver
- register custom drivers (S3, Spaces, etc.)

## Maintained Packages

Current maintained packages in the Factorydrive ecosystem:

- `local`: [`nestjs_module_factorydrive`](https://github.com/tacxou/nestjs_module_factorydrive/blob/main/src/factorydrive/local-file-system.storage.ts)
- `s3`: [`nestjs_module_factorydrive-s3`](https://github.com/tacxou/nestjs_module_factorydrive-s3)
- `sftp`: [`nestjs_module_factorydrive-sftp`](https://github.com/tacxou/nestjs_module_factorydrive-sftp)

## Requirements

- Node.js `>= 22`
- Bun `>= 1.0.0` (used for build/test in this repository)
- NestJS `^6` to `^11` (`@nestjs/common` and `@nestjs/core`)

## Installation

```bash
npm install @tacxou/nestjs_module_factorydrive
```

Or with other package managers:

```bash
yarn add @tacxou/nestjs_module_factorydrive
pnpm add @tacxou/nestjs_module_factorydrive
bun add @tacxou/nestjs_module_factorydrive
```

## Quick Start (synchronous config)

```ts
// app.module.ts
import { Module } from '@nestjs/common'
import { FactorydriveModule } from '@tacxou/nestjs_module_factorydrive'

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

## Async Configuration (`forRootAsync`)

```ts
// app.module.ts
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { FactorydriveModule } from '@tacxou/nestjs_module_factorydrive'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FactorydriveModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        default: config.get<string>('factorydrive.default', 'local'),
        disks: {
          local: {
            driver: 'local',
            config: {
              root: config.get<string>('factorydrive.localRoot', `${process.cwd()}/storage`),
            },
          },
        },
      }),
    }),
  ],
})
export class AppModule {}
```

## Usage

Inject `FactorydriveService` and interact with a disk instance:

```ts
// file-storage.service.ts
import { Injectable } from '@nestjs/common'
import { FactorydriveService } from '@tacxou/nestjs_module_factorydrive'

@Injectable()
export class FileStorageService {
  public constructor(private readonly factorydrive: FactorydriveService) {}

  public async uploadFile(path: string, buffer: Buffer): Promise<void> {
    await this.factorydrive.getDisk('local').put(path, buffer)
  }

  public async readFile(path: string): Promise<string> {
    const { content } = await this.factorydrive.getDisk('local').get(path)
    return content
  }

  public async deleteFile(path: string): Promise<boolean | null> {
    const { wasDeleted } = await this.factorydrive.getDisk('local').delete(path)
    return wasDeleted
  }
}
```

If no disk name is provided, the configured `default` disk is used:

```ts
const disk = this.factorydrive.getDisk()
```

## Built-in Local Driver

The package includes a `local` driver with the following operations:

- `append(location, content)`
- `copy(src, dest)`
- `delete(location)`
- `exists(location)`
- `get(location, encoding?)`
- `getBuffer(location)`
- `getStat(location)`
- `getStream(location)`
- `move(src, dest)`
- `prepend(location, content)`
- `put(location, content)`
- `flatList(prefix?)`
- `getUrl(location)` — unsigned URL built from the disk `baseUrl`
- `getSignedUrl(location, { expiresIn? })` — time-limited HMAC-signed URL (default `expiresIn = 900`)
- `verifySignedUrl(location, { expires, signature })` — constant-time signature + expiry check

`content` for `put` accepts `Buffer | ReadableStream | string`.

### Signed URLs (local)

The local driver has no HTTP server: `getSignedUrl` returns a URL pointing at a `baseUrl` endpoint
that **you** expose and which must call `verifySignedUrl` before streaming the file. Configure the
disk with a `signatureSecret` and a `baseUrl`:

```ts
disks: {
  local: {
    driver: 'local',
    config: {
      root: '/var/data',
      signatureSecret: process.env.STORAGE_URL_SECRET,
      baseUrl: 'https://api.example.com/files',
    },
  },
}

const { signedUrl } = await storage.getSignedUrl('threads/abc', { expiresIn: 3600 })
// -> https://api.example.com/files/threads/abc?expires=...&signature=...

// in the /files endpoint:
const ok = storage.verifySignedUrl('threads/abc', { expires, signature })
```

Both `signatureSecret` and `baseUrl` are required for signing; otherwise `getSignedUrl` throws
`InvalidConfigException`.

## Register a Custom Driver

Custom drivers must extend `AbstractStorage` and implement the methods you need.

```ts
// aws-s3.storage.ts
import { AbstractStorage, DeleteResponse, Response } from '@tacxou/nestjs_module_factorydrive'

export class AwsS3Storage extends AbstractStorage {
  public constructor(private readonly config: { bucket: string }) {
    super()
  }

  public async put(location: string, content: Buffer | NodeJS.ReadableStream | string): Promise<Response> {
    // Upload implementation...
    return { raw: { location, uploaded: true, contentType: typeof content } }
  }

  public async delete(location: string): Promise<DeleteResponse> {
    // Delete implementation...
    return { raw: { location }, wasDeleted: true }
  }
}
```

Then register it at startup:

```ts
// app.module.ts
import { Module, OnModuleInit } from '@nestjs/common'
import { FactorydriveModule, FactorydriveService } from '@tacxou/nestjs_module_factorydrive'
import { AwsS3Storage } from './aws-s3.storage'

@Module({
  imports: [
    FactorydriveModule.forRoot({
      default: 's3',
      disks: {
        s3: {
          driver: 's3',
          config: {
            bucket: 'example',
          },
        },
      },
    }),
  ],
})
export class AppModule implements OnModuleInit {
  public constructor(private readonly factorydrive: FactorydriveService) {}

  public onModuleInit(): void {
    this.factorydrive.registerDriver('s3', AwsS3Storage)
  }
}
```

## Exported API

Main exports from this package:

- `FactorydriveModule`
- `FactorydriveService`
- `AbstractStorage`
- `StorageManager`
- storage config/types from `factorydrive/types`
- exceptions from `exceptions`

## Error Handling

The module provides dedicated exceptions (for example):
- `InvalidConfigException`
- `DriverNotSupportedException`
- `FileNotFoundException`
- `PermissionMissingException`
- `MethodNotSupportedException`

Catch and map them in your service/controller layers as needed.

## License

MIT
