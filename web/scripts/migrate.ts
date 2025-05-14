import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Function to read and execute SQL migrations
async function runMigrations() {
  try {
    console.log('Starting migrations...');

    // Create migrations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Get all migration files
    const migrationsDir = path.join(process.cwd(), 'db', 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log('No migrations directory found.');
      return;
    }

    // Read migration files in order
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort(); // This ensures migrations run in order by filename

    // Get already executed migrations
    const { rows: executedMigrations } = await pool.query(
      'SELECT name FROM migrations'
    );
    const executedMigrationNames = executedMigrations.map((row) => row.name);

    // Execute migrations that haven't been run yet
    for (const migrationFile of migrationFiles) {
      if (executedMigrationNames.includes(migrationFile)) {
        console.log(`Migration ${migrationFile} already executed, skipping...`);
        continue;
      }

      console.log(`Executing migration: ${migrationFile}`);

      // Read and execute SQL
      const sqlContent = fs.readFileSync(
        path.join(migrationsDir, migrationFile),
        'utf8'
      );

      // Execute the SQL
      await pool.query(sqlContent);

      // Mark migration as executed
      await pool.query('INSERT INTO migrations (name) VALUES ($1)', [
        migrationFile,
      ]);

      console.log(`Migration ${migrationFile} executed successfully.`);
    }

    console.log('Migrations completed!');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations
runMigrations();
