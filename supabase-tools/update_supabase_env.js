/**
 * Script to update Supabase environment variables in .env files
 * Run this script after resetting and configuring your Supabase database
 * 
 * Usage: node update_supabase_env.js <supabase_url> <supabase_anon_key>
 */

const fs = require('fs');
const path = require('path');

// Get command line arguments
const supabaseUrl = process.argv[2];
const supabaseAnonKey = process.argv[3];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Missing required parameters');
  console.log('Usage: node update_supabase_env.js <supabase_url> <supabase_anon_key>');
  process.exit(1);
}

// Environment files to update
const envFiles = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
];

// Update each environment file if it exists
envFiles.forEach(envFile => {
  const filePath = path.join(process.cwd(), '..', envFile);
  
  if (fs.existsSync(filePath)) {
    console.log(`Updating ${envFile}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update or add Supabase URL
    if (content.includes('NEXT_PUBLIC_SUPABASE_URL=')) {
      content = content.replace(
        /NEXT_PUBLIC_SUPABASE_URL=.*/g,
        `NEXT_PUBLIC_SUPABASE_URL="${supabaseUrl}"`
      );
    } else {
      content += `\nNEXT_PUBLIC_SUPABASE_URL="${supabaseUrl}"`;
    }
    
    // Update or add Supabase Anon Key
    if (content.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      content = content.replace(
        /NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/g,
        `NEXT_PUBLIC_SUPABASE_ANON_KEY="${supabaseAnonKey}"`
      );
    } else {
      content += `\nNEXT_PUBLIC_SUPABASE_ANON_KEY="${supabaseAnonKey}"`;
    }
    
    // Write updated content back to file
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${envFile}`);
  }
});

// Update DATABASE_URL in .env.production if it exists
const productionEnvPath = path.join(process.cwd(), '..', '.env.production');
if (fs.existsSync(productionEnvPath)) {
  console.log('Updating DATABASE_URL in .env.production...');
  
  let content = fs.readFileSync(productionEnvPath, 'utf8');
  
  // Extract project reference from URL (assuming format: https://[project-ref].supabase.co)
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  
  if (projectRef) {
    // Update DATABASE_URL with the new project reference
    if (content.includes('DATABASE_URL=')) {
      content = content.replace(
        /DATABASE_URL="postgresql:\/\/postgres:([^@]+)@([^:]+):[^\/]+\/postgres\?sslmode=require"/g,
        `DATABASE_URL="postgresql://postgres:$1@db.${projectRef}.supabase.co:5432/postgres?sslmode=require"`
      );
      
      // Write updated content back to file
      fs.writeFileSync(productionEnvPath, content);
      console.log('✅ Updated DATABASE_URL in .env.production');
    }
  } else {
    console.warn('⚠️ Could not extract project reference from Supabase URL. DATABASE_URL not updated.');
  }
}

console.log('Environment variables updated successfully!');
console.log('Please restart your application for the changes to take effect.');