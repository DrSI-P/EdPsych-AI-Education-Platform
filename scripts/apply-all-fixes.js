/**
 * Master script to apply all fixes for the EdPsych-AI-Education-Platform
 * This script runs all the individual fix scripts in the correct order
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const scriptsDir = __dirname;
const fixScripts = [
  // Fix for the CurriculumPlanCollaborator case sensitivity issue
  'fix-curriculum-collaborator-case.js',
  
  // Targeted fix for the specific file causing the build failure
  'fix-curriculum-collaboration-route.js',
  
  // Fix TypeScript syntax errors
  'fix-apostrophes.js',
  'fix-template-literals.js',
  'fix-import-statements.js',
  'fix-uk-spelling.js',
  'fix-seed-file.js',
  'fix-remaining-typescript-errors.js',
  'fix-enhanced-typescript-errors.js',
  'fix-tabs-component.js',
  
  // Fix for the Plugin model
  'fix-plugin-model-migration.js',
  
  // Fix for the curriculum collaboration models
  'fix-curriculum-collaboration-migration.js',
  
  // Fix for the password reset model
  'fix-password-reset-migration.js',
  
  // Apply all migrations
  'apply-fix-migration.js'
];

// Main function
async function main() {
  console.log('Starting application of all fixes...');
  console.log('====================================');
  
  // Check if all scripts exist
  const missingScripts = [];
  for (const script of fixScripts) {
    const scriptPath = path.join(scriptsDir, script);
    if (!fs.existsSync(scriptPath)) {
      missingScripts.push(script);
    }
  }
  
  if (missingScripts.length > 0) {
    console.error('Error: The following scripts are missing:');
    missingScripts.forEach(script => console.error(`  - ${script}`));
    console.error('Please make sure all fix scripts are in the scripts directory.');
    process.exit(1);
  }
  
  // Run each script in sequence
  for (const script of fixScripts) {
    const scriptPath = path.join(scriptsDir, script);
    console.log(`\nRunning ${script}...`);
    console.log('------------------------------------');
    
    try {
      execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
      console.log(`✅ Successfully ran ${script}`);
    } catch (error) {
      console.error(`❌ Error running ${script}:`);
      console.error(error.message);
      console.error('\nFix application process halted due to errors.');
      console.error('Please fix the errors and try again.');
      process.exit(1);
    }
  }
  
  console.log('\n====================================');
  console.log('✅ All fixes have been successfully applied!');
  console.log('\nNext steps:');
  console.log('1. Run the TypeScript compiler to verify the fixes: npx tsc --noEmit');
  console.log('2. Test the application locally');
  console.log('3. Commit the changes and push to GitHub');
  console.log('4. Deploy to Vercel');
}

// Run the script
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});