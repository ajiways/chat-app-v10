import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const getBaseConfigPart = (): PostgresConnectionOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [join(process.cwd(), '/dist/**/*.entity.js')],
  migrations: ['dist/migrations/*.js', 'dist/seeds/*.js'],
  migrationsTableName: 'migrations',
  schema: 'public',
  logging: true,
  synchronize: true,
});

export default registerAs('typeorm', function (): PostgresConnectionOptions {
  return getBaseConfigPart();
});
