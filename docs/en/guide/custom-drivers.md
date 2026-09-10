---
description: Implement and register a custom Factorydrive AbstractStorage driver.
---

# Custom drivers

External drivers extend `AbstractStorage`. Override supported methods and let inherited
methods throw `MethodNotSupportedException` for unsupported capabilities.

## Implement a driver

```ts
import {
  AbstractStorage,
  type DeleteResponse,
  type Response,
} from '@ficsysfr/nestjs_module_factorydrive'

export class ExampleStorage extends AbstractStorage {
  public constructor(private readonly config: { namespace: string }) {
    super()
  }

  public async put(location: string, content: Buffer | NodeJS.ReadableStream | string): Promise<Response> {
    return { raw: { namespace: this.config.namespace, location, content } }
  }

  public async delete(location: string): Promise<DeleteResponse> {
    return { raw: { location }, wasDeleted: true }
  }
}
```

Keep provider clients, credentials, endpoints, and error translation inside the driver.
Return portable fields such as `content`, `exists`, `path`, or `wasDeleted`; expose
provider-specific results only under `raw`.

## Register the driver

```ts
export class AppModule {
  public constructor(factorydrive: FactorydriveService) {
    factorydrive.registerDriver('example', ExampleStorage)
  }
}
```

The `example` key must match the disk configuration. Registration must happen before
Factorydrive initializes configured disks.

## Package a satellite driver

- Use a separate `@ficsysfr/nestjs_module_factorydrive-*` package.
- Peer-depend on `@ficsysfr/nestjs_module_factorydrive@^2.0.0`.
- Keep the core free of provider SDK dependencies.
- Test supported operations, provider error mapping, streams, pagination, and cleanup.
