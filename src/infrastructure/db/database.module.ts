import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';

import { Logger } from '@nestjs/common';
import { CustomTypeOrmLogger } from './custom-typeorm-logger';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const DatabaseModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
    // eslint-disable-next-line @typescript-eslint/require-await
  ) =>
    ({
      type: 'postgres',
      url: configService.get('TYPEORM_URL'),
      host: configService.get('TYPEORM_HOST'),
      username: configService.get('TYPEORM_USERNAME'),
      password: configService.get('TYPEORM_PASSWORD'),
      database: configService.get('TYPEORM_DATABASE'),
      port: Number.parseInt(configService.get('TYPEORM_PORT')),
      entities: [`${__dirname}/{entities,views}/*.{entity,view}.{ts,js}`],
      migrations: [`${__dirname}/migrations/*.{ts,js}`],
      synchronize: false,
      migrationsRun: true,
      maxQueryExecutionTime: 1000,
      logger: new CustomTypeOrmLogger(new Logger('db')),
      logging: 'all',
      namingStrategy: new SnakeNamingStrategy(),
    } as ConnectionOptions),
  inject: [ConfigService],
});
