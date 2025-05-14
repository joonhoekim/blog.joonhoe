import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Environment variables should be properly set in your .env file
// Format: postgres://user:password@host:port/database
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString,
});

// Create a Drizzle ORM instance with the connection pool
export const db = drizzle(pool);
