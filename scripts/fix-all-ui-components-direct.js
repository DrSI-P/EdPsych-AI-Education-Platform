/**
 * Comprehensive script to fix all UI component files directly
 * This script addresses:
 * 1. Duplicate React imports
 * 2. Destructured parameter syntax errors
 * 3. Incorrect function signatures
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

// UI components directory
const UI_COMPONENTS_DIR = path.join(__dirname, '../src/components/ui');

// Function to fix duplicate React imports
function fixDuplicateReactImports(content) {
  // Check if there are multiple React imports
  const reactImportRegex = /import\s+React\s+from\s+['"]react['"];?/g;
  const matches = content.match(reactImportRegex);
  
  if (matches && matches.length > 1) {
    // Keep only the first React import
    let firstOccurrence = true;
    return content.replace(reactImportRegex, (match) => {
      if (firstOccurrence) {
        firstOccurrence = false;
        return match;
      }
      return '// Removed duplicate React import';
    });
  }
  
  return content;
}

// Function to fix destructured parameter syntax errors
function fixDestructuredParameterSyntax(content) {
  // Pattern 1: export function Component(: React.ReactNode { param1, param2 }: Props)
  let fixedContent = content.replace(
    /export\s+function\s+(\w+)\(\s*:\s*React\.ReactNode\s*\{\s*([\s\S]*?)\s*\}\s*:\s*(\w+)\s*\)/g,
    'export function $1({ $2 }: $3): React.ReactNode {'
  );
  
  // Pattern 2: export function Component() : React.ReactNode { param1, param2 }: Props)
  fixedContent = fixedContent.replace(
    /export\s+function\s+(\w+)\(\s*\)\s*:\s*React\.ReactNode\s*\{\s*([\s\S]*?)\s*\}\s*:\s*(\w+)\s*\)/g,
    'export function $1({ $2 }: $3): React.ReactNode {'
  );
  
  // Pattern 3: function Component(: React.ReactNode { param1, param2 }: Props)
  fixedContent = fixedContent.replace(
    /function\s+(\w+)\(\s*:\s*React\.ReactNode\s*\{\s*([\s\S]*?)\s*\}\s*:\s*(\w+)\s*\)/g,
    'function $1({ $2 }: $3): React.ReactNode {'
  );
  
  // Pattern 4: export function Component({ param1, param2 }: Props) {
  // This is correct, but sometimes the closing brace is on a new line
  fixedContent = fixedContent.replace(
    /export\s+function\s+(\w+)\(\s*\{\s*([\s\S]*?)\s*\}\s*:\s*(\w+)\s*\)\s*\{/g,
    'export function $1({ $2 }: $3) {'
  );
  
  // Pattern 5: export function Alert(: React.ReactNode { variant = 'default', title, children })
  // For JavaScript files without TypeScript
  fixedContent = fixedContent.replace(
    /export\s+function\s+(\w+)\(\s*:\s*React\.ReactNode\s*\{\s*([\s\S]*?)\s*\}\s*\)/g,
    'export function $1({ $2 })'
  );
  
  // Pattern 6: Fix TypeScript annotations in JavaScript files
  if (path.extname(currentFile) === '.js') {
    fixedContent = fixedContent.replace(/:\s*React\.ReactNode/g, '');
  }
  
  // Pattern 7: Fix malformed function signatures with extra brackets
  fixedContent = fixedContent.replace(
    /export\s+function\s+(\w+)\(\s*\{\s*([\s\S]*?)\s*\}\s*:\s*(\w+)\s*\)\s*:\s*React\.ReactNode\s*\{\s*\{/g,
    'export function $1({ $2 }: $3): React.ReactNode {'
  );
  
  return fixedContent;
}

// Process all UI component files
async function processUIComponentFiles() {
  try {
    // Get all files in the UI components directory
    const files = getAllFiles(UI_COMPONENTS_DIR);
    
    // Filter for .tsx and .js files
    const componentFiles = files.filter(file => 
      file.endsWith('.tsx') || file.endsWith('.js')
    );
    
    console.log(`Found ${componentFiles.length} UI component files to process`);
    
    let fixedFiles = 0;
    let duplicateImportsFixed = 0;
    let syntaxErrorsFixed = 0;
    
    // Process each file
    for (const file of componentFiles) {
      global.currentFile = file; // Make file path available to other functions
      
      const content = await readFileAsync(file, 'utf8');
      
      // Apply fixes
      let fixedContent = fixDuplicateReactImports(content);
      const duplicateFixed = fixedContent !== content;
      
      const contentAfterDuplicateFix = fixedContent;
      fixedContent = fixDestructuredParameterSyntax(fixedContent);
      const syntaxFixed = fixedContent !== contentAfterDuplicateFix;
      
      // Write back if changes were made
      if (fixedContent !== content) {
        await writeFileAsync(file, fixedContent, 'utf8');
        fixedFiles++;
        
        if (duplicateFixed) duplicateImportsFixed++;
        if (syntaxFixed) syntaxErrorsFixed++;
        
        console.log(`Fixed ${file}`);
      }
    }
    
    console.log(`
    ===== SUMMARY =====
    Total files processed: ${componentFiles.length}
    Files fixed: ${fixedFiles}
    Duplicate React imports fixed: ${duplicateImportsFixed}
    Destructured parameter syntax errors fixed: ${syntaxErrorsFixed}
    `);
    
  } catch (error) {
    console.error('Error processing UI component files:', error);
  }
}

// Helper function to get all files in a directory recursively
function getAllFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Recursively get files from subdirectories
      results = results.concat(getAllFiles(filePath));
    } else {
      results.push(filePath);
    }
  });
  
  return results;
}

// Run the script
processUIComponentFiles();
