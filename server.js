const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const next = require('next');
require('dotenv').config();

// Function to create the _prisma_migrations table and mark migrations as applied
async function setupDatabase() {
  console.log('Setting up database...');
  
  // Check if we should skip database operations
  if (process.env.SKIP_DB_CONNECT === 'true') {
    console.log('Skipping database setup as SKIP_DB_CONNECT is set to true');
    return;
  }
  
  console.log('Connecting to database...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Add SSL option for Supabase
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check if the _prisma_migrations table already exists
    const checkTableResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = '_prisma_migrations'
      );
    `);
    
    const tableExists = checkTableResult.rows[0].exists;
    
    if (tableExists) {
      console.log('The _prisma_migrations table already exists. No action needed.');
      return;
    }
    
    // Create the _prisma_migrations table
    console.log('Creating _prisma_migrations table...');
    await client.query(`
      CREATE TABLE "_prisma_migrations" (
        "id" character varying(36) NOT NULL,
        "checksum" character varying(64) NOT NULL,
        "finished_at" timestamp with time zone,
        "migration_name" character varying(255) NOT NULL,
        "logs" text,
        "rolled_back_at" timestamp with time zone,
        "started_at" timestamp with time zone NOT NULL DEFAULT now(),
        "applied_steps_count" integer NOT NULL DEFAULT 0,
        CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
      );
    `);
    
    console.log('_prisma_migrations table created successfully');
    
    // Mark all migrations as applied
    const migrationsDir = path.join(__dirname, 'prisma/migrations');
    
    // Get all migration directories
    const migrationDirs = fs.readdirSync(migrationsDir)
      .filter(dir => !dir.startsWith('_') && fs.statSync(path.join(migrationsDir, dir)).isDirectory());
    
    console.log(`Found ${migrationDirs.length} migrations to mark as applied`);
    
    for (const migrationName of migrationDirs) {
      console.log(`Marking migration ${migrationName} as applied...`);
      
      // Insert the migration as applied
      await client.query(
        `INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          require('crypto').randomUUID(), // Generate a random UUID
          'fixed-checksum',
          new Date(),
          migrationName,
          'Migration manually marked as applied',
          null,
          new Date(),
          1
        ]
      );
      
      console.log(`Migration ${migrationName} marked as applied`);
    }
    
    console.log('All migrations have been marked as applied');
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await client.end();
    console.log('Disconnected from database');
  }
}

// Initialize Next.js
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Prepare Next.js and start the server
app.prepare().then(async () => {
  // Set up the database first
  try {
    await setupDatabase();
  } catch (error) {
    console.error('Error during database setup:', error);
  }

  // Create server with Next.js handler
  const { createServer } = require('http');
  const server = createServer((req, res) => {
    // Let Next.js handle all requests
    return handle(req, res);
  });

  // Start the server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});