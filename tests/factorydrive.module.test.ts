import { describe, expect, it } from 'bun:test'
import { FactorydriveModule } from '../src/factorydrive.module'
import { FactorydriveCoreModule } from '../src/factorydrive.core-module'
import type { StorageManagerConfig } from '../src/factorydrive'

describe('FactorydriveModule', () => {
  it('forRoot delegue a FactorydriveCoreModule.forRoot', () => {
    const options: StorageManagerConfig = { default: 'main', disks: {} }

    const dynamicModule = FactorydriveModule.forRoot(options)

    expect(dynamicModule.module).toBe(FactorydriveModule)
    expect(dynamicModule.imports).toEqual([FactorydriveCoreModule.forRoot(options)])
  })

  it('forRootAsync delegue a FactorydriveCoreModule.forRootAsync', () => {
    const asyncOptions = {
      useFactory: async () => ({ default: 'main', disks: {} }),
      inject: ['CONFIG_SERVICE'],
    }

    const dynamicModule = FactorydriveModule.forRootAsync(asyncOptions)

    expect(dynamicModule.module).toBe(FactorydriveModule)
    expect(dynamicModule.imports).toEqual([FactorydriveCoreModule.forRootAsync(asyncOptions)])
  })
})
