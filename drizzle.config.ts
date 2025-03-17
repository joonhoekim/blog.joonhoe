import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { getDatabaseUrl } from './db/utils/connectionUtils';

export default defineConfig({
  out: './db/migrations',
  schema: './db/schema/*.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: getDatabaseUrl(),
  },
});
