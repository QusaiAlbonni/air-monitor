import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function typeOrmConfiguration(
  configService: ConfigService,
): TypeOrmModuleOptions {
  let extraOptions = {};
  if (configService.get<string>('NODE_ENV') === 'development') {
    extraOptions = {
      synchronize: true,
      logging: true,
    };
  } else {
    extraOptions = {
      migrations: ['./migrations/*.ts'],
      migrationsRun: true,
    };
  }
  return {
    type: 'postgres',
    url: configService.get<string>('DATABASE_URL'),
    autoLoadEntities: true,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    ...extraOptions,
  };
}
