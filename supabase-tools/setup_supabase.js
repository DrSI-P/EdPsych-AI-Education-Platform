/**
 * Script to automate Supabase setup for EdPsych Connect Platform
 * This script will:
 * 1. Create required tables
 * 2. Configure RLS policies
 * 3. Insert seed data
 * 
 * Usage: node setup_supabase.js <supabase_url> <supabase_anon_key>
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Get command line arguments
const supabaseUrl = process.argv[2];
const supabaseAnonKey = process.argv[3];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Missing required parameters');
  console.log('Usage: node setup_supabase.js <supabase_url> <supabase_anon_key>');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SQL scripts
const createTablesSQL = fs.readFileSync(path.join(__dirname, 'combined_create_tables.sql'), 'utf8');
const seedDataSQL = fs.readFileSync(path.join(__dirname, 'simplified_seed_data.sql'), 'utf8');

// Split SQL scripts into individual statements
function splitSQLStatements(sql) {
  // This is a simple split that works for most cases
  // For more complex SQL, a proper SQL parser would be needed
  return sql
    .replace(/--.*$/gm, '') // Remove comments
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);
}

// Execute SQL statements one by one
async function executeSQL(sql) {
  const statements = splitSQLStatements(sql);
  
  for (const stmt of statements) {
    try {
      console.log(`Executing SQL: ${stmt.substring(0, 50)}...`);
      
      // Try using the RPC function first
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: stmt });
        
        if (error) {
          throw new Error(error.message);
        } else {
          console.log('✅ SQL executed successfully via RPC');
          continue;
        }
      } catch (rpcError) {
        console.log(`RPC execution failed: ${rpcError.message}`);
        console.log('Trying direct REST API execution...');
      }
      
      // Try using the REST API as a fallback
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'Prefer': 'params=single-object'
          },
          body: JSON.stringify({
            query: stmt
          })
        });
        
        if (!response.ok) {
          const result = await response.json();
          throw new Error(JSON.stringify(result));
        }
        
        console.log('✅ SQL executed successfully via REST API');
      } catch (apiError) {
        console.error(`Error executing SQL via REST API: ${apiError.message}`);
        console.error(`Failed statement: ${stmt}`);
        console.log('You may need to execute this SQL statement manually in the Supabase SQL Editor.');
      }
    } catch (error) {
      console.error(`Exception executing SQL: ${error.message}`);
      console.error(`Failed statement: ${stmt}`);
      console.log('You may need to execute this SQL statement manually in the Supabase SQL Editor.');
    }
  }
}

// Create storage buckets
async function createStorageBuckets() {
  const buckets = [
    { name: 'avatars', public: false },
    { name: 'video-thumbnails', public: false },
    { name: 'public-assets', public: true }
  ];
  
  let createdBuckets = 0;
  
  for (const bucket of buckets) {
    try {
      console.log(`Creating storage bucket: ${bucket.name}`);
      
      const { data, error } = await supabase
        .storage
        .createBucket(bucket.name, {
          public: bucket.public
        });
      
      if (error) {
        // Check if the error is because the bucket already exists
        if (error.message.includes('already exists')) {
          console.log(`✅ Bucket ${bucket.name} already exists`);
          createdBuckets++;
        } else {
          console.error(`Error creating bucket ${bucket.name}: ${error.message}`);
          console.log(`You may need to create the ${bucket.name} bucket manually in the Supabase dashboard.`);
        }
      } else {
        console.log(`✅ Created bucket: ${bucket.name}`);
        createdBuckets++;
      }
    } catch (error) {
      console.error(`Exception creating bucket ${bucket.name}: ${error.message}`);
      console.log(`You may need to create the ${bucket.name} bucket manually in the Supabase dashboard.`);
    }
  }
  
  if (createdBuckets === buckets.length) {
    console.log('✅ All storage buckets created successfully');
  } else {
    console.log(`⚠️ Created ${createdBuckets} out of ${buckets.length} storage buckets`);
    console.log('You may need to create the remaining buckets manually in the Supabase dashboard.');
  }
}

// Main function
async function setupSupabase() {
  console.log('🔧 Setting up Supabase for EdPsych Connect Platform...\n');
  
  try {
    // Step 1: Create tables and configure RLS
    console.log('Step 1: Creating tables and configuring RLS...');
    await executeSQL(createTablesSQL);
    
    // Step 2: Insert seed data
    console.log('\nStep 2: Inserting seed data...');
    await executeSQL(seedDataSQL);
    
    // Step 3: Create storage buckets
    console.log('\nStep 3: Creating storage buckets...');
    await createStorageBuckets();
    
    console.log('\n✅ Supabase setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Configure Authentication Settings (Site URL, Email provider)');
    console.log('2. Update API Settings (JWT expiry)');
    console.log('3. Run the verification script: node verify_supabase_reset.js');
    
  } catch (error) {
    console.error('\n❌ Supabase setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupSupabase();