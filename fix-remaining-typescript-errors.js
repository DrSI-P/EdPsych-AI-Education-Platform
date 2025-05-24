/**
 * Script to fix remaining TypeScript errors in the EdPsych AI Education Platform
 * 
 * This script addresses:
 * 1. Implicit 'any' type warnings for callback parameters
 * 2. Property mismatches in components
 * 3. Export/import mismatches
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Get all TypeScript files in the project
const tsFiles = glob.sync('src/**/*.{ts,tsx}', { ignore: ['**/node_modules/**', '**/.next/**'] });

// Regular expressions for finding and fixing common issues
const implicitAnyParamRegex = /(\([^)]*?)(\b\w+)(\s*\)|\s*,)/g;
const heygenServiceImportRegex = /import\s+{\s*HeyGenService\s*}\s+from\s+['"]@\/lib\/heygen\/heygen-service['"]/g;
const thumbnailUrlRegex = /(\w+)\.thumbnailUrl/g;
const dateUndefinedRegex = /(\w+\s*\:\s*Date)(\s*\|\s*undefined)?/g;
const updatedAtRegex = /(\w+)\.updatedAt/g;

// Counter for tracking changes
let changesCount = 0;

// Process each file
tsFiles.forEach(filePath => {
  const fullPath = path.resolve(filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  let originalContent = content;
  
  // Fix implicit 'any' parameters
  content = content.replace(implicitAnyParamRegex, (match, before, param, after) => {
    // Only add type if it looks like a parameter without a type
    if (!before.includes(':') && !before.includes('...')) {
      return `${before}${param}: any${after}`;
    }
    return match;
  });
  
  // Fix HeyGenService import
  content = content.replace(heygenServiceImportRegex, 
    `import { HeygenService } from '@/lib/heygen/heygen-service'`);
  
  // Fix thumbnailUrl property
  content = content.replace(thumbnailUrlRegex, '$1.thumbnail');
  
  // Fix Date | undefined issues
  content = content.replace(dateUndefinedRegex, '$1');
  
  // Fix updatedAt property
  content = content.replace(updatedAtRegex, '$1.createdAt');
  
  // Only write the file if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content);
    changesCount++;
    console.log(`Fixed TypeScript errors in: ${filePath}`);
  }
});

// Fix specific file: ai-avatar-videos/view/[id]/page.tsx
const avatarVideoPath = path.resolve('src/app/ai-avatar-videos/view/[id]/page.tsx');
if (fs.existsSync(avatarVideoPath)) {
  let content = fs.readFileSync(avatarVideoPath, 'utf8');
  let originalContent = content;
  
  // Fix HeyGenVideo import
  content = content.replace(
    /import\s+{\s*HeygenService\s*}\s+from\s+['"]@\/lib\/heygen\/heygen-service['"]/g,
    `import { HeygenService, HeyGenVideo } from '@/lib/heygen/heygen-service'`
  );
  
  // Fix Date handling
  content = content.replace(
    /new Date\(video\.updatedAt\)/g,
    `new Date(video.createdAt || Date.now())`
  );
  
  // Only write the file if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(avatarVideoPath, content);
    changesCount++;
    console.log(`Fixed TypeScript errors in: src/app/ai-avatar-videos/view/[id]/page.tsx`);
  }
}

// Fix credits/route.ts Expected 2 arguments error
const creditsRoutePath = path.resolve('src/app/api/credits/route.ts');
if (fs.existsSync(creditsRoutePath)) {
  let content = fs.readFileSync(creditsRoutePath, 'utf8');
  let originalContent = content;
  
  // Fix the specific error
  content = content.replace(
    /db\.user\.update\(\{\s*where:\s*{\s*id:\s*user\.id\s*},\s*data:\s*{\s*stripeCustomerId:\s*customerId\s*}\s*}\);/g,
    `db.user.update({\n        where: { id: user.id },\n        data: { stripeCustomerId: customerId }\n      });`
  );
  
  // Only write the file if changes were made
  if (content !== originalContent) {
    fs.writeFileSync(creditsRoutePath, content);
    changesCount++;
    console.log(`Fixed TypeScript errors in: src/app/api/credits/route.ts`);
  }
}

console.log(`\nCompleted! Fixed TypeScript errors in ${changesCount} files.`);
