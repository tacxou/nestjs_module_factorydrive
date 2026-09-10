---
description: Générer et vérifier les URLs signées locales ou S3 avec Factorydrive.
---

# URLs signées

Les URLs signées locales et S3 n’utilisent pas le même modèle de confiance.

## URL locale

Configurer `baseUrl` et `signatureSecret` :

```ts
{
  driver: 'local',
  config: {
    root: '/var/data',
    baseUrl: 'https://api.example.com/files',
    signatureSecret: process.env.STORAGE_URL_SECRET!,
  },
}
```

```ts
const { signedUrl } = await this.factorydrive
  .getDisk()
  .getSignedUrl('documents/report.pdf', { expiresIn: 3600 })
```

`expiresIn` est exprimé en secondes et vaut 900 par défaut. Factorydrive signe la clé
et l’expiration en HMAC-SHA256, mais ne sert aucun trafic HTTP.

La route applicative récupère exactement la même clé, convertit `expires`, appelle
`verifySignedUrl()` puis ouvre le flux seulement si la vérification réussit. Ne pas
reproduire le calcul HMAC dans l’application.

## URL S3

Le driver S3 délègue la signature au SDK AWS v3 :

```ts
const { signedUrl } = await this.factorydrive
  .getDisk()
  .getSignedUrl('documents/report.pdf', { expiresIn: 60 })
```

Le fournisseur valide la requête. S3 n’implémente pas `verifySignedUrl()`. Le driver
SFTP actuel n’implémente aucune des deux opérations d’URL signée.
