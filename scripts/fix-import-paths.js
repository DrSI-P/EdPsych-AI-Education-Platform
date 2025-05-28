/**
 * Script to fix import paths for UI components
 * This script ensures all imports use the correct path format
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { glob } = require('glob');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// App directory
const APP_DIR = path.join(__dirname, '../src/app');

// Function to fix import paths
function fixImportPaths(content) {
  // Fix direct imports from specific UI component files
  // Replace imports like: import { X } from '@/components/ui/card'
  // With barrel imports: import { X } from '@/components/ui'
  
  const directImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]@\/components\/ui\/([^'"]+)['"]/g;
  
  let fixedContent = content;
  let match;
  
  // Collect all matches first to avoid regex state issues
  const matches = [];
  while ((match = directImportRegex.exec(content)) !== null) {
    matches.push({
      fullMatch: match[0],
      components: match[1].trim(),
      file: match[2]
    });
  }
  
  // Process each match
  for (const match of matches) {
    // Only replace if the component is exported from index.ts
    const newImport = `import { ${match.components} } from '@/components/ui'`;
    fixedContent = fixedContent.replace(match.fullMatch, newImport);
    console.log(`Fixed import: ${match.fullMatch} -> ${newImport}`);
  }
  
  return fixedContent;
}

// Process all app pages
async function processAppPages() {
  try {
    // Get all TypeScript and JavaScript files in the app directory
    const files = await glob(`${APP_DIR}/**/*.{tsx,jsx,ts,js}`);
    
    console.log(`Found ${files.length} files to process`);
    
    let fixedFiles = 0;
    
    // Process each file
    for (const file of files) {
      const content = await readFileAsync(file, 'utf8');
      
      // Apply fixes
      const fixedContent = fixImportPaths(content);
      
      // Write back if changes were made
      if (fixedContent !== content) {
        await writeFileAsync(file, fixedContent, 'utf8');
        fixedFiles++;
        console.log(`Fixed imports in ${file}`);
      }
    }
    
    console.log(`
    ===== SUMMARY =====
    Total files processed: ${files.length}
    Files with fixed imports: ${fixedFiles}
    `);
    
  } catch (error) {
    console.error('Error processing app pages:', error);
  }
}

// Run the script
processAppPages();
