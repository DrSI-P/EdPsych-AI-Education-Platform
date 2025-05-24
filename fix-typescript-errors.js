const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const rootDir = path.resolve(__dirname);
const componentsDir = path.join(rootDir, 'src/components');
const pagesDir = path.join(rootDir, 'src/app');

// Patterns to fix
const fixPatterns = [
  // Fix default exports to named exports in accessibility components
  {
    pattern: /export default (\w+);/g,
    replacement: 'export { $1 };',
    filter: (filePath) => filePath.includes('/components/ai/accessibility/')
  },
  // Fix import statements for accessibility components
  {
    pattern: /import (\w+) from ['"]@\/components\/ai\/accessibility\/([^'"]+)['"]/g,
    replacement: 'import { $1 } from \'@/components/ai/accessibility/$2\'',
    filter: (filePath) => filePath.includes('/app/accessibility/')
  },
  // Fix className prop on Alert components
  {
    pattern: /<Alert className="([^"]+)">/g,
    replacement: '<Alert>',
    filter: (filePath) => filePath.includes('/app/accessibility/')
  },
  // Add missing settings prop to components
  {
    pattern: /<(\w+Engine)\s+onSettingsChange={([^}]+)}\s*(?!settings=)/g,
    replacement: '<$1 settings={settings} onSettingsChange={$2}',
    filter: (filePath) => filePath.includes('/app/accessibility/')
  }
];

// Function to process a file
function processFile(filePath) {
  console.log(`Processing ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Apply each pattern if it matches the filter
  fixPatterns.forEach(({ pattern, replacement, filter }) => {
    if (filter(filePath) && pattern.test(content)) {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
        console.log(`  Applied pattern: ${pattern}`);
      }
    }
  });

  // Save the file if modified
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Updated ${filePath}`);
    return true;
  }
  
  return false;
}

// Find all TypeScript/TSX files in components and pages directories
const componentFiles = glob.sync(path.join(componentsDir, '**/*.{ts,tsx}'));
const pageFiles = glob.sync(path.join(pagesDir, '**/*.{ts,tsx}'));
const allFiles = [...componentFiles, ...pageFiles];

// Process all files
let totalModified = 0;
allFiles.forEach(filePath => {
  if (processFile(filePath)) {
    totalModified++;
  }
});

console.log(`\nCompleted processing ${allFiles.length} files.`);
console.log(`Modified ${totalModified} files.`);
