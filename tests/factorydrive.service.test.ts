import { describe, expect, it, spyOn } from 'bun:test'
import { FactorydriveService } from '../src/factorydrive.service'
import AbstractStorage from '../src/factorydrive/abstract.storage'
import type { StorageManagerConfig } from '../src/factorydrive'

class FakeStorage extends AbstractStorage {}

describe('FactorydriveService', () => {
  const baseConfig: StorageManagerConfig = {
    default: 'main',
    disks: {
      main: { driver: 'fake', config: { root: '/tmp' } },
    },
    registerLocalDriver: false,
  }

  it('delegue onModuleInit au storageManager', async () => {
    const service = new FactorydriveService(baseConfig)
    const manager = (service as unknown as { storageManager: { initDisks: () => Promise<void> } }).storageManager
    const initSpy = spyOn(manager, 'initDisks').mockResolvedValue(undefined)

    await service.onModuleInit()

    expect(initSpy).toHaveBeenCalledTimes(1)
  })

  it('delegue getDisk au storageManager', () => {
    const service = new FactorydriveService(baseConfig)
    const manager = (service as unknown as { storageManager: { disk: (name?: string) => AbstractStorage } }).storageManager
    const fakeDisk = new FakeStorage()
    const diskSpy = spyOn(manager, 'disk').mockReturnValue(fakeDisk)

    const result = service.getDisk<FakeStorage>('archive')

    expect(diskSpy).toHaveBeenCalledTimes(1)
    expect(diskSpy).toHaveBeenCalledWith('archive')
    expect(result).toBe(fakeDisk)
  })

  it('delegue registerDriver au storageManager', () => {
    const service = new FactorydriveService(baseConfig)
    const manager = (service as unknown as { storageManager: { registerDriver: (name: string, driver: new (...args: any[]) => AbstractStorage) => void } }).storageManager
    const registerSpy = spyOn(manager, 'registerDriver')

    service.registerDriver('fake', FakeStorage)

    expect(registerSpy).toHaveBeenCalledTimes(1)
    expect(registerSpy).toHaveBeenCalledWith('fake', FakeStorage)
  })
})
