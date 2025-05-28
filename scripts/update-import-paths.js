/**
 * Script to update import paths in all app pages
 * This script fixes the import paths to use the correct barrel exports
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all .tsx files in the app directory
const appFiles = glob.sync('src/app/**/*.tsx');

console.log(`Found ${appFiles.length} files to process`);

let updatedFiles = 0;

appFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  let modified = false;

  // Fix imports for UI components
  if (content.includes('@/components/ui')) {
    // Replace imports like: import { Button } from '@/components/ui/button'
    // With: import { Button } from '../../components/ui'
    content = content.replace(/import\s+\{([^}]+)\}\s+from\s+['"]@\/components\/ui\/([^'"]+)['"]/g, (match, components, componentFile) => {
      modified = true;
      return `import { ${components} } from '../../components/ui'`;
    });

    // Replace imports like: import { Button, Card } from '@/components/ui'
    // With relative path based on file location
    if (content.includes("import") && content.includes("from '@/components/ui'")) {
      const relativePath = path.relative(path.dirname(file), 'src/components').replace(/\\/g, '/');
      content = content.replace(/from\s+['"]@\/components\/ui['"]/g, `from '${relativePath}/ui'`);
      modified = true;
    }
  }

  // Fix imports for About components
  if (content.includes('@/components/about')) {
    // Replace imports like: import TeamMember from '@/components/about/TeamMember'
    // With relative path based on file location
    const relativePath = path.relative(path.dirname(file), 'src/components').replace(/\\/g, '/');
    content = content.replace(/from\s+['"]@\/components\/about\/TeamMember['"]/g, `from '${relativePath}/about/TeamMember'`);
    content = content.replace(/from\s+['"]@\/components\/about['"]/g, `from '${relativePath}/about'`);
    modified = true;
  }

  // Save the file if it was modified
  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    updatedFiles++;
    console.log(`Updated: ${file}`);
  }
});

console.log(`Updated ${updatedFiles} files out of ${appFiles.length}`);
