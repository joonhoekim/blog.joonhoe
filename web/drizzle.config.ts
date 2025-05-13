import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('See your .env file for DATABASE_URL');
} else {
  console.log('Got DATABASE_URL successfully from .env file');
}

export default defineConfig({
  out: './db/migrations',
  schema: './db/schema/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl,
  },
});
