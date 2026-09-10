---
description: Implémenter et enregistrer un driver Factorydrive basé sur AbstractStorage.
---

# Drivers personnalisés

Un driver externe étend `AbstractStorage`. Il surcharge les opérations prises en charge
et laisse les autres méthodes lancer `MethodNotSupportedException`.

```ts
import {
  AbstractStorage,
  type DeleteResponse,
  type Response,
} from '@ficsysfr/nestjs_module_factorydrive'

export class ExampleStorage extends AbstractStorage {
  public async put(location: string, content: Buffer | NodeJS.ReadableStream | string): Promise<Response> {
    return { raw: { location, content } }
  }

  public async delete(location: string): Promise<DeleteResponse> {
    return { raw: { location }, wasDeleted: true }
  }
}
```

Garder le client fournisseur, les identifiants, les endpoints et la traduction des
erreurs dans le driver. Les informations spécifiques restent sous `raw`.

```ts
export class AppModule {
  public constructor(factorydrive: FactorydriveService) {
    factorydrive.registerDriver('example', ExampleStorage)
  }
}
```

La clé d’enregistrement correspond à `disks.*.driver` et doit être enregistrée avant
l’initialisation. Un package satellite utilise le préfixe
`@ficsysfr/nestjs_module_factorydrive-*` et déclare le cœur `^2.0.0` en peer dependency.
