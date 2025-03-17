import { drizzle } from "drizzle-orm/node-postgres";

export function getDatabaseUrl() {
    const username = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT;
    const database = process.env.DB_DATABASE;

    if (!username || !password || !host || !port || !database) {
        throw new Error('DATABASE_URL is not set');
    }

    return `postgresql://${username}:${password}@${host}:${port}/${database}`;
}

export function createConnectionFromEnv(): ReturnType<typeof drizzle> {
  const DATABASE_URL = getDatabaseUrl();

  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  return drizzle(DATABASE_URL);
}