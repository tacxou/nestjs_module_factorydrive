import { describe, expect, it } from 'bun:test'
import { InvalidConfigException } from '../src/exceptions'
import { LocalFileSystemStorage } from '../src/factorydrive/local-file-system.storage'

const make = (over: Record<string, unknown> = {}) =>
  new LocalFileSystemStorage({ root: '/tmp/fd', signatureSecret: 'topsecret', baseUrl: 'https://api.test/files', ...over } as never)

describe('LocalFileSystemStorage — signed URLs', () => {
  it('signe une URL puis la vérifie', async () => {
    const storage = make()
    const { signedUrl, raw } = await storage.getSignedUrl('threads/abc', { expiresIn: 60 })
    const { expires, signature } = raw as { expires: number; signature: string }

    expect(signedUrl.startsWith('https://api.test/files/threads/abc?expires=')).toBe(true)
    expect(signedUrl).toContain(`signature=${signature}`)
    expect(storage.verifySignedUrl('threads/abc', { expires, signature })).toBe(true)
  })

  it('rejette une signature altérée ou un location différent', async () => {
    const storage = make()
    const { raw } = await storage.getSignedUrl('threads/abc')
    const { expires, signature } = raw as { expires: number; signature: string }

    // même longueur, contenu modifié
    const tampered = `${signature}x`.slice(1)
    expect(storage.verifySignedUrl('threads/abc', { expires, signature: tampered })).toBe(false)
    expect(storage.verifySignedUrl('threads/other', { expires, signature })).toBe(false)
  })

  it('rejette une URL expirée', async () => {
    const storage = make()
    const { raw } = await storage.getSignedUrl('threads/abc', { expiresIn: -1 })
    const { expires, signature } = raw as { expires: number; signature: string }
    expect(storage.verifySignedUrl('threads/abc', { expires, signature })).toBe(false)
  })

  it('exige signatureSecret et baseUrl pour signer', () => {
    expect(() => make({ signatureSecret: undefined }).getSignedUrl('a/b')).toThrow(InvalidConfigException)
    expect(() => make({ baseUrl: undefined }).getSignedUrl('a/b')).toThrow(InvalidConfigException)
  })
})
