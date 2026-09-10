---
description: Generate and verify local or S3 signed URLs safely with Factorydrive.
---

# Signed URLs

Local and S3 signed URLs have different trust and serving models.

## Local signed URLs

Configure both `baseUrl` and `signatureSecret`:

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

`expiresIn` is expressed in seconds and defaults to 900. The URL contains an absolute
expiry timestamp and an HMAC-SHA256 signature.

Factorydrive does not serve the file. The application route must recover the exact
storage key, parse `expires`, call `verifySignedUrl()`, and only then open the stream:

```ts
const expires = Number(expiresValue)
const disk = this.factorydrive.getDisk()

if (!disk.verifySignedUrl(location, { expires, signature })) {
  throw new ForbiddenException('Invalid or expired file URL')
}

return disk.getStream(location)
```

Preserve application authorization checks when the signed URL is not intended to be a
standalone bearer capability. Never recreate the HMAC in application code.

## S3 signed URLs

The S3 driver delegates signing to AWS SDK v3:

```ts
const { signedUrl } = await this.factorydrive
  .getDisk()
  .getSignedUrl('documents/report.pdf', { expiresIn: 60 })
```

The storage provider validates the request. S3 does not implement
`verifySignedUrl()`. The current SFTP driver implements neither signed URL operation.
