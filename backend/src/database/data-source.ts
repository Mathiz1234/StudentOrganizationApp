import * as path from 'path';
import { DataSource } from 'typeorm';

import config from '../modules/shared/services/config/config';

const migrationsPath = path.join(__dirname, 'migrations/**/*{.ts,.js}');
const entitiesPath = path.join(__dirname, '/../**/*.entity{.ts,.js}');
const subscribersPath = path.join(__dirname, '/**/*.subscriber{.ts,.js}');

export default new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  schema: config.db.schema,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  synchronize: false,
  subscribers: [subscribersPath],
});
