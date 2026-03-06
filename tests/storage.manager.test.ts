import { describe, expect, it } from 'bun:test'
import StorageManager from '../src/factorydrive/storage.manager'
import AbstractStorage from '../src/factorydrive/abstract.storage'
import { DriverNotSupportedException, InvalidConfigException } from '../src/exceptions'
import type { StorageManagerConfig } from '../src/factorydrive/types'

class FakeStorage extends AbstractStorage {
  public config: unknown
  public initCalls = 0

  public constructor(config?: unknown) {
    super()
    this.config = config
  }

  public async onStorageInit(): Promise<void> {
    this.initCalls += 1
  }
}

describe('StorageManager', () => {
  it('enregistre le driver local par defaut', () => {
    const manager = new StorageManager({ default: 'localDisk', disks: {} })
    expect(manager.getDrivers().has('local')).toBe(true)
  })

  it('n enregistre pas le driver local si desactive', () => {
    const manager = new StorageManager({
      default: 'localDisk',
      disks: {},
      registerLocalDriver: false,
    })
    expect(manager.getDrivers().has('local')).toBe(false)
  })

  it('leve une erreur si aucun nom de disque n est fourni', () => {
    const manager = new StorageManager({ disks: {}, registerLocalDriver: false })
    expect(() => manager.disk()).toThrow(InvalidConfigException.missingDiskName().message)
  })

  it('leve une erreur quand la config du disque est absente', () => {
    const manager = new StorageManager({
      default: 'missing',
      disks: {},
      registerLocalDriver: false,
    })
    expect(() => manager.disk()).toThrow(InvalidConfigException.missingDiskConfig('missing').message)
  })

  it('leve une erreur quand le driver du disque est manquant', () => {
    const manager = new StorageManager({
      default: 'broken',
      disks: { broken: {} as StorageManagerConfig['disks'][string] },
      registerLocalDriver: false,
    })
    expect(() => manager.disk()).toThrow(InvalidConfigException.missingDiskDriver('broken').message)
  })

  it('leve une erreur quand le driver n est pas supporte', () => {
    const manager = new StorageManager({
      default: 'custom',
      disks: {
        custom: { driver: 'not-registered', config: {} },
      },
      registerLocalDriver: false,
    })

    try {
      manager.disk()
    } catch (error) {
      expect(error).toBeInstanceOf(DriverNotSupportedException)
      expect((error as DriverNotSupportedException).driver).toBe('not-registered')
      return
    }

    throw new Error('Expected DriverNotSupportedException')
  })

  it('cree puis met en cache le disque', () => {
    const manager = new StorageManager({
      default: 'custom',
      disks: {
        custom: { driver: 'fake', config: { key: 'value' } },
      },
      registerLocalDriver: false,
    })

    manager.registerDriver('fake', FakeStorage)

    const firstDisk = manager.disk<FakeStorage>()
    const secondDisk = manager.disk<FakeStorage>()

    expect(firstDisk).toBeInstanceOf(FakeStorage)
    expect(firstDisk.config).toEqual({ key: 'value' })
    expect(secondDisk).toBe(firstDisk)
    expect(manager.getDisks().size).toBe(1)
  })

  it('ajoute dynamiquement un disque', () => {
    const manager = new StorageManager({
      default: 'dynamic',
      disks: {},
      registerLocalDriver: false,
    })

    manager.registerDriver('fake', FakeStorage)
    manager.addDisk('dynamic', { driver: 'fake', config: { env: 'test' } })

    const disk = manager.disk<FakeStorage>()
    expect(disk.config).toEqual({ env: 'test' })
  })

  it('refuse un nom de disque deja existant', () => {
    const manager = new StorageManager({
      default: 'diskA',
      disks: {
        diskA: { driver: 'fake', config: {} },
      },
      registerLocalDriver: false,
    })

    expect(() => manager.addDisk('diskA', { driver: 'fake', config: {} })).toThrow(InvalidConfigException.duplicateDiskName('diskA').message)
  })

  it('initialise tous les disques configures', async () => {
    const manager = new StorageManager({
      default: 'one',
      disks: {
        one: { driver: 'fake', config: { id: 1 } },
        two: { driver: 'fake', config: { id: 2 } },
      },
      registerLocalDriver: false,
    })

    manager.registerDriver('fake', FakeStorage)

    await manager.initDisks()

    const one = manager.disk<FakeStorage>('one')
    const two = manager.disk<FakeStorage>('two')
    expect(one.initCalls).toBe(1)
    expect(two.initCalls).toBe(1)
  })
})
