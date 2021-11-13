import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';

import { Logger } from '@nestjs/common';
import { CustomTypeOrmLogger } from './custom-typeorm-logger';

export const DatabaseModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService,
    // eslint-disable-next-line @typescript-eslint/require-await
  ) => ({
    type: 'postgres',
    url: configService.get('TYPEORM_URL'),
    entities: [`${__dirname}/{entities,views}/*.{entity,view}.{ts,js}`],
    migrations: [`${__dirname}/migrations/*.{ts,js}`],
    synchronize: false,
    migrationsRun: true,
    maxQueryExecutionTime: 1000,
    logger: new CustomTypeOrmLogger(new Logger('db')),
    logging: 'all',
  } as ConnectionOptions),
  inject: [ConfigService],
});
