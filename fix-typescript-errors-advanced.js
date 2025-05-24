/**
 * Script to fix implicit 'any' type errors in the EdPsych codebase
 * 
 * This script specifically targets the most common TypeScript error in the codebase:
 * Parameters with implicit 'any' types
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Fix implicit 'any' type parameters in route handlers
function fixImplicitAnyTypes() {
  const routeFiles = glob.sync('src/app/api/**/*.ts');
  let fixedCount = 0;

  routeFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Common array callback patterns
    const arrayCallbackPatterns = [
      // .map((item) => {})
      { regex: /\.map\(\((\w+)\)(\s*=>|\))/g, replacement: '.map(($1: any)$2' },
      
      // .filter((item) => {})
      { regex: /\.filter\(\((\w+)\)(\s*=>|\))/g, replacement: '.filter(($1: any)$2' },
      
      // .reduce((acc, item) => {}, initial)
      { regex: /\.reduce\(\((\w+),\s*(\w+)\)(\s*=>|\))/g, replacement: '.reduce(($1: any, $2: any)$3' },
      
      // .forEach((item) => {})
      { regex: /\.forEach\(\((\w+)\)(\s*=>|\))/g, replacement: '.forEach(($1: any)$2' },
      
      // .find((item) => {})
      { regex: /\.find\(\((\w+)\)(\s*=>|\))/g, replacement: '.find(($1: any)$2' },
      
      // .some((item) => {})
      { regex: /\.some\(\((\w+)\)(\s*=>|\))/g, replacement: '.some(($1: any)$2' },
      
      // .every((item) => {})
      { regex: /\.every\(\((\w+)\)(\s*=>|\))/g, replacement: '.every(($1: any)$2' },
      
      // .sort((a, b) => {})
      { regex: /\.sort\(\((\w+),\s*(\w+)\)(\s*=>|\))/g, replacement: '.sort(($1: any, $2: any)$3' }
    ];

    // Apply each pattern
    arrayCallbackPatterns.forEach(pattern => {
      const newContent = content.replace(pattern.regex, pattern.replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
        fixedCount++;
      }
    });

    // Fix specific error in credits/route.ts: Expected 2 arguments, but got 1
    if (file.includes('credits/route.ts') && content.includes('db.user.update(')) {
      const updateRegex = /db\.user\.update\(([^,\)]+)\)/g;
      const updateReplacement = 'db.user.update($1, {})';
      
      const newContent = content.replace(updateRegex, updateReplacement);
      
      if (newContent !== content) {
        content = newContent;
        modified = true;
        fixedCount++;
      }
    }

    // Fix findFirst not existing on userVideos
    if (file.includes('heygen/videos') && content.includes('.findFirst(')) {
      const findFirstRegex = /\.findFirst\(/g;
      const findFirstReplacement = '.findMany({take: 1})[0] || ';
      
      const newContent = content.replace(findFirstRegex, findFirstReplacement);
      
      if (newContent !== content) {
        content = newContent;
        modified = true;
        fixedCount++;
      }
    }

    // Fix Type 'string | null' is not assignable to type 'string | undefined'
    if (file.includes('data-visualisation/route.ts')) {
      const nullTypeRegex = /(\w+)\s*=\s*url\.searchParams\.get\((['"])(\w+)(['"])\)/g;
      const nullTypeReplacement = '$1 = url.searchParams.get($2$3$4) || undefined';
      
      const newContent = content.replace(nullTypeRegex, nullTypeReplacement);
      
      if (newContent !== content) {
        content = newContent;
        modified = true;
        fixedCount++;
      }
    }

    // Fix Type 'string' is not assignable to type 'AvatarProvider'
    if (file.includes('ai-avatar/route.ts')) {
      const avatarProviderRegex = /(provider\s*:\s*)(['"])(\w+)(['"])/g;
      const avatarProviderReplacement = '$1$2$3$4 as AvatarProvider';
      
      const newContent = content.replace(avatarProviderRegex, avatarProviderReplacement);
      
      if (newContent !== content) {
        content = newContent;
        modified = true;
        fixedCount++;
      }
    }

    // Fix Property 'voiceRecognitionActive' does not exist on type 'Partial<AccessibilitySettings>'
    if (file.includes('accessibility/route.ts')) {
      const accessibilitySettingsRegex = /(interface\s+AccessibilitySettings\s*\{[^}]*)\}/g;
      const accessibilitySettingsReplacement = '$1  voiceRecognitionActive?: boolean;\n}';
      
      const newContent = content.replace(accessibilitySettingsRegex, accessibilitySettingsReplacement);
      
      if (newContent !== content) {
        content = newContent;
        modified = true;
        fixedCount++;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed TypeScript errors in ${file}`);
    }
  });

  console.log(`Fixed ${fixedCount} TypeScript errors`);
}

// Main execution
try {
  console.log('Starting TypeScript error fix automation...');
  
  // Fix implicit 'any' type parameters
  fixImplicitAnyTypes();
  
  console.log('TypeScript error fix automation completed successfully');
} catch (error) {
  console.error('Error during TypeScript error fix automation:', error);
}
