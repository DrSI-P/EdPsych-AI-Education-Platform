const http = require('http');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
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

// Create a simple HTML page
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EdPsych AI Education Platform</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #0070f3;
            text-align: center;
        }
        .container {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
            margin-top: 20px;
            background-color: #f9f9f9;
        }
        .status {
            background-color: #ffebee;
            border-left: 4px solid #f44336;
            padding: 10px;
            margin: 20px 0;
        }
        .next-steps {
            background-color: #e8f5e9;
            border-left: 4px solid #4caf50;
            padding: 10px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>EdPsych AI Education Platform</h1>
    
    <div class="container">
        <h2>Deployment Status</h2>
        <div class="status">
            <p><strong>Database Setup Required</strong></p>
            <p>The application has been deployed successfully, but the database tables need to be created.</p>
        </div>
        
        <h2>Next Steps</h2>
        <div class="next-steps">
            <p>To complete the setup, the following steps need to be performed:</p>
            <ol>
                <li>Run database migrations to create the necessary tables</li>
                <li>Verify database connectivity</li>
                <li>Redeploy the application with database access enabled</li>
            </ol>
        </div>
    </div>
</body>
</html>
`;

// Create a simple server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    
    // Set up the database
    try {
        await setupDatabase();
    } catch (error) {
        console.error('Error during database setup:', error);
    }
});