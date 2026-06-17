import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function typeOrmConfiguration(
  configService: ConfigService,
  entitiesPath: string,
): TypeOrmModuleOptions {
  let extraOptions = {};
  if (configService.get<string>('NODE_ENV') === 'development') {
    extraOptions = {
      synchronize: true,
      logging: true,
    };
  }
  return {
    type: 'postgres',
    url: configService.get<string>('DATABASE_URL'),
    autoLoadEntities: true,
    entities: [entitiesPath],
    ...extraOptions,
  };
}
