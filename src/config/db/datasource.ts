import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
config();

export default new DataSource({
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
  logging: false,
});
