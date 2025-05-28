/**
 * Script to fix duplicate Link imports in the codebase
 * 
 * This script resolves conflicts between Next.js Link and UI Link components
 * by renaming the UI Link component to UILink in the central export file
 * and updating all imports accordingly.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Root directory to start scanning from
const ROOT_DIR = path.resolve(__dirname, '../src');

// File extensions to process
const FILE_EXTENSIONS = ['.tsx', '.jsx', '.ts', '.js'];

// Counter for statistics
let stats = {
  filesScanned: 0,
  filesModified: 0,
  linkImportsFixed: 0,
  errors: 0,
};

/**
 * Check if a file has conflicting Link imports
 * @param {string} filePath - Path to the file
 * @returns {boolean} - Whether the file has conflicting imports
 */
function hasConflictingLinkImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for both next/link and @/components/ui Link imports
    const hasNextLink = /import\s+Link\s+from\s+['"]next\/link['"]/.test(content);
    const hasUILink = /import\s+{\s*Link(\s*,|\s*})/.test(content) && 
                     /from\s+['"]@\/components\/ui['"]/.test(content);
    
    return hasNextLink && hasUILink;
  } catch (error) {
    console.error(`Error checking imports in ${filePath}:`, error);
    stats.errors++;
    return false;
  }
}

/**
 * Fix conflicting Link imports in a file
 * @param {string} filePath - Path to the file
 */
function fixLinkImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace UI Link import with UILink
    // This handles both cases:
    // 1. import { Link } from '@/components/ui';
    // 2. import { Button, Link, Card } from '@/components/ui';
    
    // First, check if there's a UI import with Link
    if (content.includes('from \'@/components/ui\'') || content.includes('from "@/components/ui"')) {
      // Replace Link with UILink in UI imports
      content = content.replace(
        /import\s+{([^}]*)Link([^}]*)}\s+from\s+['"]@\/components\/ui['"]/g,
        'import {$1UILink$2} from \'@/components/ui\''
      );
      
      // Replace Link usage with UILink in JSX
      // This is a bit more complex as we need to ensure we're only replacing UI Link usage
      // We'll look for <Link patterns but not next/link usage
      
      // Replace <Link> tags with <UILink>
      content = content.replace(/<Link(\s+[^>]*>|\s*>)/g, '<UILink$1');
      content = content.replace(/<\/Link>/g, '</UILink>');
      
      stats.linkImportsFixed++;
      stats.filesModified++;
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed Link imports in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing imports in ${filePath}:`, error);
    stats.errors++;
  }
}

/**
 * Update the UI components index file to rename Link to UILink
 */
function updateUIComponentsIndex() {
  const indexPath = path.resolve(__dirname, '../src/components/ui/index.ts');
  
  try {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Rename Link export to UILink
    content = content.replace(
      /export\s+{\s*Link\s*}\s+from\s+['"]\.\/link['"];/,
      'export { Link as UILink } from \'./link\';'
    );
    
    // If the above pattern doesn't match, try a more general approach
    if (!content.includes('UILink')) {
      content = content.replace(
        /(export\s+{[^}]*)Link([^}]*}\s+from\s+['"]\.\/link['"];)/,
        '$1Link as UILink$2'
      );
    }
    
    fs.writeFileSync(indexPath, content, 'utf8');
    console.log('✅ Updated UI components index file to rename Link to UILink');
    
    return true;
  } catch (error) {
    console.error('Error updating UI components index file:', error);
    stats.errors++;
    return false;
  }
}

/**
 * Recursively scan directory for files to process
 * @param {string} dir - Directory to scan
 */
function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and .next directories
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        scanDirectory(fullPath);
      }
    } else if (FILE_EXTENSIONS.includes(path.extname(entry.name))) {
      stats.filesScanned++;
      
      if (hasConflictingLinkImports(fullPath)) {
        console.log(`Found conflicting Link imports in ${fullPath}`);
        fixLinkImports(fullPath);
      }
    }
  }
}

// Main execution
console.log('Starting Link import conflict resolution script...');

try {
  // First update the UI components index file
  if (updateUIComponentsIndex()) {
    // Then scan and fix all files with conflicting imports
    console.log(`Scanning from ${ROOT_DIR}`);
    scanDirectory(ROOT_DIR);
    
    // Print statistics
    console.log('\n--- Link Import Fix Statistics ---');
    console.log(`Files scanned: ${stats.filesScanned}`);
    console.log(`Files modified: ${stats.filesModified}`);
    console.log(`Link imports fixed: ${stats.linkImportsFixed}`);
    console.log(`Errors encountered: ${stats.errors}`);
    console.log('---------------------------');
    
    if (stats.errors > 0) {
      console.warn(`⚠️ Script completed with ${stats.errors} errors. Some files may need manual fixes.`);
    } else {
      console.log('✅ Script completed successfully!');
    }
  }
} catch (error) {
  console.error('Fatal error:', error);
}
