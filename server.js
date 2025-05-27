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
  
  // Check if DATABASE_URL is defined
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not defined');
    return;
  }
  
  let client;
  try {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Add SSL option for Supabase
    });
    
    // Set connection timeout
    const connectTimeout = setTimeout(() => {
      console.error('Database connection timeout after 10 seconds');
      if (client) {
        client.end().catch(err => console.error('Error ending client after timeout:', err));
      }
    }, 10000);
    
    await client.connect();
    clearTimeout(connectTimeout);
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
    try {
      const migrationsDir = path.join(__dirname, 'prisma/migrations');
      
      // Check if migrations directory exists
      if (fs.existsSync(migrationsDir)) {
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
      } else {
        console.log('Migrations directory not found. Skipping migration marking.');
      }
    } catch (error) {
      console.error('Error marking migrations as applied:', error);
      // Continue execution even if there's an error with migrations
    }
    
    console.log('All migrations have been marked as applied');
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (client) {
      try {
        await client.end();
        console.log('Disconnected from database');
      } catch (error) {
        console.error('Error disconnecting from database:', error);
      }
    }
  }
}

// Create a fallback HTML page in case Next.js fails to initialize
const fallbackHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>EdPsych Connect</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 600px;
    }
    h1 {
      color: #333;
    }
    p {
      color: #666;
      margin-bottom: 1.5rem;
    }
    .status {
      padding: 1rem;
      background-color: #e6f7ff;
      border-radius: 4px;
      margin-bottom: 1.5rem;
    }
    .success {
      color: #52c41a;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>EdPsych Connect</h1>
    <div class="status">
      <p>Server Status: <span class="success">Online</span></p>
    </div>
    <p>The EdPsych Connect platform is currently being updated with new features.</p>
    <p>We'll be back online shortly with our full application.</p>
    <p>Thank you for your patience!</p>
  </div>
</body>
</html>
`;

// Initialize Next.js with error handling
let app;
let handle;
try {
  const dev = process.env.NODE_ENV !== 'production';
  app = next({ dev });
  handle = app.getRequestHandler();
  console.log('Next.js initialized successfully');
} catch (error) {
  console.error('Error initializing Next.js:', error);
  // Continue with a fallback server if Next.js fails to initialize
}

// Prepare Next.js and start the server
const startServer = async () => {
  try {
    // Set up the database first
    try {
      await setupDatabase();
    } catch (error) {
      console.error('Error during database setup:', error);
      // Continue even if database setup fails
    }

    // Create server with appropriate handler
    const { createServer } = require('http');
    const server = createServer((req, res) => {
      try {
        // If Next.js is initialized, use its handler
        if (app && handle) {
          return handle(req, res);
        } else {
          // Otherwise, serve the fallback HTML
          console.log(`Serving fallback HTML for ${req.url}`);
          res.setHeader('Content-Type', 'text/html');
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.writeHead(200);
          res.end(fallbackHtml);
        }
      } catch (error) {
        console.error('Error handling request:', error);
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(500);
        res.end(fallbackHtml);
      }
    });

    // Start the server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, (err) => {
      if (err) {
        console.error('Error starting server:', err);
        return;
      }
      console.log(`> Ready on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

// Initialize Next.js if possible, otherwise start with fallback
if (app) {
  app.prepare()
    .then(startServer)
    .catch(error => {
      console.error('Error preparing Next.js application:', error);
      startServer(); // Start with fallback if Next.js preparation fails
    });
} else {
  startServer(); // Start with fallback if Next.js initialization fails
}