/**
 * Script to verify Supabase database reset and configuration
 * Run this script after executing the supabase_reset.sql script
 * 
 * Usage: node verify_supabase_reset.js <supabase_url> <supabase_anon_key>
 */

const { createClient } = require('@supabase/supabase-js');

// Get command line arguments
const supabaseUrl = process.argv[2];
const supabaseAnonKey = process.argv[3];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Missing required parameters');
  console.log('Usage: node verify_supabase_reset.js <supabase_url> <supabase_anon_key>');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tables that should exist after reset
const requiredTables = [
  'users',
  'avatar_videos',
  'user_progress',
  'achievements'
];

// Main verification function
async function verifySupabaseReset() {
  console.log('🔍 Verifying Supabase database reset and configuration...\n');
  
  try {
    // Check if required tables exist
    await verifyTablesExist();
    
    // Check if avatar_videos seed data exists
    await verifySeedData();
    
    // Verify storage buckets
    await verifyStorageBuckets();
    
    console.log('\n✅ Verification complete! The Supabase database has been properly reset and configured.');
    
  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
  }
}

// Verify that all required tables exist
async function verifyTablesExist() {
  console.log('Checking if required tables exist...');
  
  // Get list of tables in public schema
  const { data: tables, error } = await supabase
    .from('pg_tables')
    .select('tablename')
    .eq('schemaname', 'public');
  
  if (error) {
    throw new Error(`Failed to fetch tables: ${error.message}`);
  }
  
  const tableNames = tables.map(t => t.tablename);
  
  // Check if all required tables exist
  const missingTables = requiredTables.filter(table => !tableNames.includes(table));
  
  if (missingTables.length > 0) {
    throw new Error(`Missing tables: ${missingTables.join(', ')}`);
  }
  
  console.log('✅ All required tables exist');
  
  // Log all found tables
  console.log(`   Found tables: ${tableNames.join(', ')}`);
}

// Verify that seed data exists in avatar_videos table
async function verifySeedData() {
  console.log('\nChecking if seed data exists in avatar_videos table...');
  
  const { data: videos, error } = await supabase
    .from('avatar_videos')
    .select('*');
  
  if (error) {
    throw new Error(`Failed to fetch avatar videos: ${error.message}`);
  }
  
  if (!videos || videos.length === 0) {
    throw new Error('No seed data found in avatar_videos table');
  }
  
  if (videos.length < 3) {
  throw new Error(`Expected at least 3 avatar videos, but found only ${videos.length}`);
}

console.log(`✅ Seed data exists in avatar_videos table (${videos.length} records)`);
  
  // Log a few sample videos
  console.log('   Sample videos:');
  videos.slice(0, 3).forEach(video => {
    console.log(`   - ${video.title} (${video.category})`);
  });
}

// Verify that storage buckets exist
async function verifyStorageBuckets() {
  console.log('\nChecking if required storage buckets exist...');
  
  const requiredBuckets = [
    'avatars',
    'video-thumbnails',
    'public-assets'
  ];
  
  const { data: buckets, error } = await supabase
    .storage
    .listBuckets();
  
  if (error) {
    throw new Error(`Failed to fetch storage buckets: ${error.message}`);
  }
  
  if (!buckets || buckets.length === 0) {
    console.log('⚠️ No storage buckets found. Please create the required buckets manually.');
    return;
  }
  
  const bucketNames = buckets.map(b => b.name);
  
  // Check if all required buckets exist
  const missingBuckets = requiredBuckets.filter(bucket => !bucketNames.includes(bucket));
  
  if (missingBuckets.length > 0) {
    console.log(`⚠️ Missing storage buckets: ${missingBuckets.join(', ')}`);
    console.log('   Please create these buckets manually as described in the guide.');
  } else {
    console.log('✅ All required storage buckets exist');
  }
  
  // Log all found buckets
  console.log(`   Found buckets: ${bucketNames.join(', ')}`);
}

// Run the verification
verifySupabaseReset();