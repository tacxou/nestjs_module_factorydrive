import { ModuleMetadata, Type } from '@nestjs/common'
import type { StorageManagerConfig } from './factorydrive'

export interface FactorydriveModuleOptionsFactory {
  createFactorydriveModuleOptions(): Promise<StorageManagerConfig> | StorageManagerConfig
}

export interface FactorydriveModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[]
  useClass?: Type<FactorydriveModuleOptionsFactory>
  useExisting?: Type<FactorydriveModuleOptionsFactory>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory?: (...args: any[]) => Promise<StorageManagerConfig> | StorageManagerConfig
}
