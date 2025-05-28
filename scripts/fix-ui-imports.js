/**
 * Script to automatically add required UI component imports to affected files
 * 
 * This script scans the codebase for files with missing UI component imports
 * and adds the necessary import statements.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Components to check for and their import source
const UI_COMPONENTS = {
  'Card': '@/components/ui',
  'CardHeader': '@/components/ui',
  'CardTitle': '@/components/ui',
  'CardDescription': '@/components/ui',
  'CardContent': '@/components/ui',
  'CardFooter': '@/components/ui',
  'Button': '@/components/ui',
  'Badge': '@/components/ui',
  'Tabs': '@/components/ui',
  'TabsContent': '@/components/ui',
  'TabsList': '@/components/ui',
  'TabsTrigger': '@/components/ui',
  'Link': '@/components/ui',
  'Pagination': '@/components/ui',
  'BookOpen': '@/components/ui',
  'Mic': '@/components/ui',
};

// React import to add if 'React' is not defined
const REACT_IMPORT = "import React from 'react';\n";

// Root directory to start scanning from
const ROOT_DIR = path.resolve(__dirname, '../src');

// File extensions to process
const FILE_EXTENSIONS = ['.tsx', '.jsx', '.ts', '.js'];

// Files to skip (if needed)
const SKIP_FILES = [
  'src/components/ui/index.ts',
  'src/components/ui/card.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/badge.tsx',
  'src/components/ui/tabs.tsx',
  'src/components/ui/link.tsx',
  'src/components/ui/pagination.tsx',
];

// Counter for statistics
let stats = {
  filesScanned: 0,
  filesModified: 0,
  componentsAdded: 0,
  reactImportsAdded: 0,
  errors: 0,
};

/**
 * Check if a file needs UI component imports
 * @param {string} filePath - Path to the file
 * @returns {Object} - Object with components needed and whether React is needed
 */
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const neededComponents = [];
    let needsReact = false;

    // Check for each UI component
    for (const component in UI_COMPONENTS) {
      // Check if component is used but not imported
      const componentRegex = new RegExp(`<${component}[\\s/>]|<${component}>|component="${component}"`, 'g');
      const importRegex = new RegExp(`import[^;]*{[^}]*${component}[^}]*}[^;]*from`, 'g');
      
      if (componentRegex.test(content) && !importRegex.test(content)) {
        neededComponents.push(component);
      }
    }

    // Check if React is used but not imported
    if (/React\.|\sReact[^a-zA-Z0-9_]/.test(content) && !/(import|require)[^;]*React/.test(content)) {
      needsReact = true;
    }

    return { neededComponents, needsReact };
  } catch (error) {
    console.error(`Error analyzing file ${filePath}:`, error);
    stats.errors++;
    return { neededComponents: [], needsReact: false };
  }
}

/**
 * Add imports to a file
 * @param {string} filePath - Path to the file
 * @param {Array} components - Components to import
 * @param {boolean} needsReact - Whether React import is needed
 */
function addImports(filePath, components, needsReact) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Group components by import source
    const importGroups = {};
    components.forEach(component => {
      const source = UI_COMPONENTS[component];
      if (!importGroups[source]) {
        importGroups[source] = [];
      }
      importGroups[source].push(component);
    });

    // Create import statements
    for (const source in importGroups) {
      const componentsForSource = importGroups[source];
      if (componentsForSource.length > 0) {
        const importStatement = `import { ${componentsForSource.join(', ')} } from '${source}';\n`;
        
        // Add import after existing imports or at the beginning
        if (content.includes('import ')) {
          const lastImportIndex = content.lastIndexOf('import ');
          const endOfImportsIndex = content.indexOf('\n', content.indexOf(';', lastImportIndex)) + 1;
          content = content.slice(0, endOfImportsIndex) + importStatement + content.slice(endOfImportsIndex);
        } else {
          content = importStatement + content;
        }
        
        modified = true;
        stats.componentsAdded += componentsForSource.length;
      }
    }

    // Add React import if needed
    if (needsReact) {
      if (!content.includes("import React")) {
        if (content.includes('import ')) {
          const firstImportIndex = content.indexOf('import ');
          content = content.slice(0, firstImportIndex) + REACT_IMPORT + content.slice(firstImportIndex);
        } else {
          content = REACT_IMPORT + content;
        }
        modified = true;
        stats.reactImportsAdded++;
      }
    }

    // Write back to file if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      stats.filesModified++;
      console.log(`✅ Updated imports in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error adding imports to ${filePath}:`, error);
    stats.errors++;
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
    const relativePath = path.relative(path.resolve(__dirname, '..'), fullPath);
    
    // Skip files in the skip list
    if (SKIP_FILES.some(skipFile => relativePath.includes(skipFile))) {
      continue;
    }
    
    if (entry.isDirectory()) {
      // Skip node_modules and .next directories
      if (entry.name !== 'node_modules' && entry.name !== '.next') {
        scanDirectory(fullPath);
      }
    } else if (FILE_EXTENSIONS.includes(path.extname(entry.name))) {
      stats.filesScanned++;
      const { neededComponents, needsReact } = analyzeFile(fullPath);
      
      if (neededComponents.length > 0 || needsReact) {
        console.log(`Found missing imports in ${relativePath}`);
        addImports(fullPath, neededComponents, needsReact);
      }
    }
  }
}

// Main execution
console.log('Starting UI component import fix script...');
console.log(`Scanning from ${ROOT_DIR}`);

try {
  // Create UI component directory if it doesn't exist
  const uiDir = path.resolve(__dirname, '../src/components/ui');
  if (!fs.existsSync(uiDir)) {
    fs.mkdirSync(uiDir, { recursive: true });
    console.log('Created UI components directory');
  }
  
  // Start scanning
  scanDirectory(ROOT_DIR);
  
  // Print statistics
  console.log('\n--- Import Fix Statistics ---');
  console.log(`Files scanned: ${stats.filesScanned}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`UI components added: ${stats.componentsAdded}`);
  console.log(`React imports added: ${stats.reactImportsAdded}`);
  console.log(`Errors encountered: ${stats.errors}`);
  console.log('---------------------------');
  
  if (stats.errors > 0) {
    console.warn(`⚠️ Script completed with ${stats.errors} errors. Some files may need manual fixes.`);
  } else {
    console.log('✅ Script completed successfully!');
  }
} catch (error) {
  console.error('Fatal error:', error);
}
