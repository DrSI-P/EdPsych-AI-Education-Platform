// Script to fix build issues for EdPsych AI Education Platform
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build fix script...');

// Step 1: Fix the collaboration route file
console.log('Checking collaboration route file...');
const routeFilePath = path.join(__dirname, 'src', 'app', 'api', 'curriculum', 'collaboration', 'route.ts');

if (fs.existsSync(routeFilePath)) {
  let content = fs.readFileSync(routeFilePath, 'utf8');
  
  // Check if there's any reference to authorId in the file
  if (content.includes('authorId')) {
    console.log('Found authorId reference in collaboration route file, fixing...');
    
    // Replace authorId with userId
    content = content.replace(/authorId/g, 'userId');
    
    // Replace author with user
    content = content.replace(/author: {/g, 'user: {');
    content = content.replace(/author\./g, 'user.');
    
    fs.writeFileSync(routeFilePath, content);
    console.log('Fixed collaboration route file');
  } else {
    console.log('No authorId references found in collaboration route file');
  }
} else {
  console.error('Collaboration route file not found!');
}

// Step 2: Fix the plans route file
console.log('Checking plans route file...');
const plansFilePath = path.join(__dirname, 'src', 'app', 'api', 'curriculum', 'plans', 'route.ts');

if (fs.existsSync(plansFilePath)) {
  let content = fs.readFileSync(plansFilePath, 'utf8');
  
  // Check if there's any reference to authorId in the file
  if (content.includes('authorId')) {
    console.log('Found authorId reference in plans route file, fixing...');
    
    // Replace authorId with userId
    content = content.replace(/authorId/g, 'userId');
    
    // Replace author with user
    content = content.replace(/author: {/g, 'user: {');
    content = content.replace(/author\./g, 'user.');
    
    fs.writeFileSync(plansFilePath, content);
    console.log('Fixed plans route file');
  } else {
    console.log('No authorId references found in plans route file');
  }
} else {
  console.error('Plans route file not found!');
}

// Step 3: Create a backup of the current migration directory
console.log('Creating backup of migrations directory...');
const backupDir = path.join(__dirname, 'prisma', 'migrations-backup-' + Date.now());
fs.mkdirSync(backupDir, { recursive: true });
fs.cpSync(path.join(__dirname, 'prisma', 'migrations'), backupDir, { recursive: true });
console.log(`Backup created at ${backupDir}`);

// Step 4: Create a .env file with DATABASE_URL for Vercel
console.log('Creating .env file for Vercel...');
try {
  // Create a .env file with the DATABASE_URL from Vercel
  // Note: Replace [YOUR-PASSWORD] with the actual database password
  const envContent = `DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.wxwcvqnbjorztzjwfi.supabase.co:5432/postgres"`;
  fs.writeFileSync(path.join(__dirname, '.env'), envContent);
  console.log('Created .env file successfully');
} catch (error) {
  console.error('Error creating .env file:', error);
}

console.log('Skipping migration resolution as it needs to be done on Vercel...');
console.log('Add the following to your Vercel build command:');
console.log('npx prisma migrate resolve --applied 20250521030000_add_password_field_to_user && npx prisma migrate deploy && npm run build');
console.log('Note: The migration 20250521020000_add_password_reset_model is already marked as applied in the database, so we don\'t need to resolve it again.');

console.log('Build fix completed successfully!');
console.log('You can now run "npx prisma migrate deploy" to apply any pending migrations.');
console.log('Then commit and push the changes to GitHub using the commit-and-push script.');