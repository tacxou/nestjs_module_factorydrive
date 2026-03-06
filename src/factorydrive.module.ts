import { DynamicModule, Module } from '@nestjs/common'
import type { FactorydriveModuleAsyncOptions } from './factorydrive.interfaces'
import { FactorydriveCoreModule } from './factorydrive.core-module'
import type { StorageManagerConfig } from './factorydrive'

@Module({})
export class FactorydriveModule {
  public static forRoot(options: StorageManagerConfig): DynamicModule {
    return {
      module: FactorydriveModule,
      imports: [FactorydriveCoreModule.forRoot(options)],
    }
  }

  public static forRootAsync(options: FactorydriveModuleAsyncOptions): DynamicModule {
    return {
      module: FactorydriveModule,
      imports: [FactorydriveCoreModule.forRootAsync(options)],
    }
  }
}
