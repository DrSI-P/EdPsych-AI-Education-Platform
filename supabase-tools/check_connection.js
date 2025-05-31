/**
 * Simple script to check if the Supabase URL is accessible
 * 
 * Usage: node check_connection.js <supabase_url>
 */

const fetch = require('node-fetch');

// Get command line arguments
const supabaseUrl = process.argv[2];

if (!supabaseUrl) {
  console.error('Error: Missing required parameter');
  console.log('Usage: node check_connection.js <supabase_url>');
  process.exit(1);
}

// Check if the Supabase URL is accessible
async function checkConnection() {
  console.log(`Checking connection to ${supabaseUrl}...`);
  
  try {
    const response = await fetch(supabaseUrl);
    
    if (response.ok) {
      console.log('✅ Connection successful!');
      console.log(`Status: ${response.status} ${response.statusText}`);
    } else {
      console.error(`❌ Connection failed with status: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`❌ Connection failed: ${error.message}`);
    console.log('\nPossible reasons:');
    console.log('1. The Supabase URL is incorrect');
    console.log('2. There is a network connectivity issue');
    console.log('3. The Supabase project does not exist or is not accessible');
    
    // Check if it's a DNS resolution issue
    if (error.code === 'ENOTFOUND') {
      console.log('\nThis appears to be a DNS resolution issue. The hostname could not be found.');
      console.log('Please verify that the Supabase project reference in the URL is correct.');
    }
  }
}

// Run the check
checkConnection();