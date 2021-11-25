import {
  ConnectionOptions,
  createConnection,
  getConnectionOptions,
} from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const config: ConnectionOptions = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  port: Number.parseInt(process.env.TYPEORM_PORT),

  entities: [__dirname + '/src/infrastructure/db/entities/*.entity{.ts,.js}'],

  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: true,
  logging: true,
  logger: 'file',

  // allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev
  migrations: [__dirname + '/src/infrastructure/db/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/infrastructure/db/migrations',
    entitiesDir: 'src/infrastructure/db/entities',
  },
};

getConnectionOptions().then((connectionOptions) => {
  return createConnection(
    Object.assign(connectionOptions, {
      namingStrategy: new SnakeNamingStrategy(),
    }),
  );
});

export default config;
