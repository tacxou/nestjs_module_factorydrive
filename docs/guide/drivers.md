---
description: Comparer les drivers Factorydrive maintenus pour le stockage local, S3 et SFTP.
---

# Drivers local, S3 et SFTP

## Matrice de capacités

| Capacité | Local | S3 | SFTP |
| --- | --- | --- | --- |
| `put`, `get`, `getBuffer` | Oui | Oui | Oui |
| `copy`, `move`, `delete`, `exists` | Oui | Oui | Oui |
| `getStat`, `getStream`, `flatList` | Oui | Oui | Oui |
| `append`, `prepend` | Oui | Non | Non |
| `getUrl` | Oui | Non | Non |
| `getSignedUrl` | Oui | Oui | Non |
| `verifySignedUrl` | Oui | Non | Non |

## Système de fichiers local

- Package : `@ficsysfr/nestjs_module_factorydrive`
- Classe : `LocalFileSystemStorage`, enregistrée automatiquement sous `local`
- Configuration obligatoire : `root`
- Configuration URL optionnelle : `baseUrl`, `signatureSecret`

Le driver local convient à une machine unique ou à un volume monté géré en dehors de
Factorydrive. Il n’expose pas de serveur HTTP.

## S3

- Package : `@ficsysfr/nestjs_module_factorydrive-s3`
- Classe : `AwsS3Storage`
- Configuration obligatoire : `bucket`
- Options supplémentaires : `S3ClientConfig` du SDK AWS v3

Le driver fonctionne avec Amazon S3 et les fournisseurs compatibles. Une URL signée
S3 est validée par le fournisseur.

## SFTP

- Package : `@ficsysfr/nestjs_module_factorydrive-sftp`
- Classe : `SFTPStorage`
- Configuration obligatoire : `root` distant et `options` de connexion

Le driver se connecte pendant `onStorageInit()`. Préférer une authentification par clé
si l’environnement de déploiement le permet.

## Choisir

- Local pour un stockage hôte ou monté.
- S3 pour du stockage objet et des téléchargements signés par le fournisseur.
- SFTP pour échanger avec un système externe qui l’impose.
- Le disque par défaut lorsque le comportement métier ne dépend pas du fournisseur.
