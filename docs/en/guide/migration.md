---
description: Migrate Factorydrive applications from the deprecated @tacxou packages to @ficsysfr 2.0.0.
---

# Migration from `@tacxou`

Factorydrive 2.0.0 moves every maintained package to the `@ficsysfr` npm scope. The
TypeScript API and storage behavior are unchanged; package names and import specifiers
are the breaking change.

## Package mapping

| Deprecated package | Replacement |
| --- | --- |
| `@tacxou/nestjs_module_factorydrive` | `@ficsysfr/nestjs_module_factorydrive` |
| `@tacxou/nestjs_module_factorydrive-s3` | `@ficsysfr/nestjs_module_factorydrive-s3` |
| `@tacxou/nestjs_module_factorydrive-sftp` | `@ficsysfr/nestjs_module_factorydrive-sftp` |

## Migration steps

1. Remove every installed package in the deprecated scope.
2. Install core 2.0.0 and each required driver at 2.0.0 under `@ficsysfr`.
3. Replace package import specifiers in source, tests, mocks, and configuration.
4. Refresh the lockfile with the application's existing package manager.
5. Run the application's complete test and build suites.

```ts
// Before
import { FactorydriveService } from '@tacxou/nestjs_module_factorydrive'

// After
import { FactorydriveService } from '@ficsysfr/nestjs_module_factorydrive'
```

No compatibility shim is published. Deprecated packages remain installable for legacy
applications but receive no 2.x updates.

## Maintainer deprecation step

Run these commands only after all replacements are publicly installable and verified:

```bash
npm deprecate "@tacxou/nestjs_module_factorydrive@*" "Moved to @ficsysfr/nestjs_module_factorydrive"
npm deprecate "@tacxou/nestjs_module_factorydrive-s3@*" "Moved to @ficsysfr/nestjs_module_factorydrive-s3"
npm deprecate "@tacxou/nestjs_module_factorydrive-sftp@*" "Moved to @ficsysfr/nestjs_module_factorydrive-sftp"
```

Deprecation is a manual rollout operation, not part of any release workflow.
