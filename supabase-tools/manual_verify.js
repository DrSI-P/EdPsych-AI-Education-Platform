/**
 * Simple script to verify Supabase configuration after manual setup
 * 
 * Usage: node manual_verify.js <supabase_url> <supabase_anon_key>
 */

const { createClient } = require('@supabase/supabase-js');

// Get command line arguments
const supabaseUrl = process.argv[2];
const supabaseAnonKey = process.argv[3];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Missing required parameters');
  console.log('Usage: node manual_verify.js <supabase_url> <supabase_anon_key>');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tables that should exist after setup
const requiredTables = [
  'users',
  'avatar_videos',
  'user_progress',
  'achievements'
];

// Storage buckets that should exist
const requiredBuckets = [
  'avatars',
  'video-thumbnails',
  'public-assets'
];

// Main verification function
async function verifySupabaseSetup() {
  console.log('🔍 Verifying Supabase configuration...\n');
  
  try {
    // Check if required tables exist
    await verifyTablesExist();
    
    // Check if seed data exists
    await verifySeedData();
    
    // Verify storage buckets
    await verifyStorageBuckets();
    
    // Verify authentication settings
    await verifyAuthSettings();
    
    console.log('\n✅ Verification complete! The Supabase configuration is correct.');
    
  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
  }
}

// Verify that all required tables exist
async function verifyTablesExist() {
  console.log('Checking if required tables exist...');
  
  try {
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
    console.log(`   Found tables: ${tableNames.join(', ')}`);
  } catch (error) {
    console.error(`❌ Table verification failed: ${error.message}`);
    throw error;
  }
}

// Verify that seed data exists
async function verifySeedData() {
  console.log('\nChecking if seed data exists...');
  
  try {
    // Check users table
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');
    
    if (usersError) {
      throw new Error(`Failed to fetch users: ${usersError.message}`);
    }
    
    if (!users || users.length === 0) {
      throw new Error('No seed data found in users table');
    }
    
    console.log(`✅ Found ${users.length} users in the users table`);
    
    // Check avatar_videos table
    const { data: videos, error: videosError } = await supabase
      .from('avatar_videos')
      .select('*');
    
    if (videosError) {
      throw new Error(`Failed to fetch avatar videos: ${videosError.message}`);
    }
    
    if (!videos || videos.length === 0) {
      throw new Error('No seed data found in avatar_videos table');
    }
    
    console.log(`✅ Found ${videos.length} videos in the avatar_videos table`);
    
    // Check user_progress table
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*');
    
    if (progressError) {
      throw new Error(`Failed to fetch user progress: ${progressError.message}`);
    }
    
    if (!progress || progress.length === 0) {
      throw new Error('No seed data found in user_progress table');
    }
    
    console.log(`✅ Found ${progress.length} records in the user_progress table`);
    
    // Check achievements table
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*');
    
    if (achievementsError) {
      throw new Error(`Failed to fetch achievements: ${achievementsError.message}`);
    }
    
    if (!achievements || achievements.length === 0) {
      throw new Error('No seed data found in achievements table');
    }
    
    console.log(`✅ Found ${achievements.length} records in the achievements table`);
  } catch (error) {
    console.error(`❌ Seed data verification failed: ${error.message}`);
    throw error;
  }
}

// Verify that storage buckets exist
async function verifyStorageBuckets() {
  console.log('\nChecking if required storage buckets exist...');
  
  try {
    const { data: buckets, error } = await supabase
      .storage
      .listBuckets();
    
    if (error) {
      throw new Error(`Failed to fetch storage buckets: ${error.message}`);
    }
    
    if (!buckets || buckets.length === 0) {
      throw new Error('No storage buckets found');
    }
    
    const bucketNames = buckets.map(b => b.name);
    
    // Check if all required buckets exist
    const missingBuckets = requiredBuckets.filter(bucket => !bucketNames.includes(bucket));
    
    if (missingBuckets.length > 0) {
      throw new Error(`Missing storage buckets: ${missingBuckets.join(', ')}`);
    }
    
    console.log('✅ All required storage buckets exist');
    console.log(`   Found buckets: ${bucketNames.join(', ')}`);
  } catch (error) {
    console.error(`❌ Storage bucket verification failed: ${error.message}`);
    throw error;
  }
}

// Verify authentication settings
async function verifyAuthSettings() {
  console.log('\nChecking authentication settings...');
  console.log('✅ Authentication verification is not automated');
  console.log('   Please manually verify the following in the Supabase dashboard:');
  console.log('   1. Site URL is set to https://edpsychconnect.com');
  console.log('   2. Email provider is enabled');
  console.log('   3. JWT expiry time is set to an appropriate value');
}

// Run the verification
verifySupabaseSetup();