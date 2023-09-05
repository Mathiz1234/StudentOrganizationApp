import 'dotenv/config';

/**
 * Please use config provided by ConfigService (ConfigModule),
 * use this config only if you need to access env variables
 * without starting the app (eg. for CLI purposes)
 */
export default {
  env: process.env.NODE_ENV,
  db: {
    type: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    schema: process.env.DB_SCHEMA,
  },
};
