import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfiguration } from './typeorm.config';

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(entitiesPath: string): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return typeOrmConfiguration(configService, entitiesPath);
          },
        }),
      ],
      providers: [],
    };
  }
}
