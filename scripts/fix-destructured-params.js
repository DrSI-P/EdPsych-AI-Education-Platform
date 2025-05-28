/**
 * Script to fix destructured parameter lists in function signatures
 * 
 * This script addresses errors like: 
 *   `export function TeamMember() : React.ReactNode {
 *     name,
 *     title,
 *     ...
 *   }: TeamMemberProps) {`
 * 
 * by correcting the function signature to proper TypeScript syntax with destructured parameters.
 */

const fs = require("fs");
const path = require("path");

// Root directory to start scanning from
const ROOT_DIR = path.resolve(__dirname, "..");

// File extensions to process
const FILE_EXTENSIONS = [".tsx", ".jsx"];

// Counter for statistics
let stats = {
  filesScanned: 0,
  filesModified: 0,
  destructuredSignaturesFixed: 0,
  errors: 0,
};

/**
 * Fix destructured parameter lists in function signatures
 * @param {string} filePath - Path to the file
 * @param {string} content - File content
 * @returns {string} - Updated file content
 */
function fixDestructuredParameterLists(filePath, content) {
  // After manual inspection, we found the actual pattern is:
  // export function TeamMember() : React.ReactNode {
  //   name,
  //   title,
  //   ...
  // }: TeamMemberProps) {
  
  // This is a very specific pattern that's hard to match with regex
  // So we'll use a line-by-line approach
  
  const lines = content.split("\n");
  let modified = false;
  let i = 0;
  
  while (i < lines.length) {
    // Look for function declaration with return type but no parameters
    const funcDeclMatch = lines[i].match(/^(\s*export\s+(?:default\s+)?function\s+[A-Za-z0-9_$]+\s*\(\)\s*:\s*React\.ReactNode\s*{)\s*$/);
    
    if (funcDeclMatch) {
      console.log(`Found potential function with error at line ${i} in ${filePath}`);
      
      // Check if the next lines contain parameter names followed by a type declaration
      let j = i + 1;
      let paramLines = [];
      let foundClosingPattern = false;
      
      while (j < lines.length && !foundClosingPattern) {
        // Check if this line contains a parameter name
        if (lines[j].trim().match(/^[A-Za-z0-9_$]+,?\s*$/)) {
          paramLines.push(lines[j]);
        }
        // Check if this line contains the closing pattern }: PropsType) {
        else if (lines[j].match(/^\s*}:\s*[A-Za-z0-9_$.]+Props\s*\)\s*{/)) {
          foundClosingPattern = true;
          break;
        }
        // If we find a line that doesn't match either pattern, this isn't what we're looking for
        else if (lines[j].trim() !== "") {
          break;
        }
        j++;
      }
      
      // If we found the closing pattern and have parameter lines, we need to fix this function
      if (foundClosingPattern && paramLines.length > 0) {
        console.log(`Confirmed function with error at line ${i} in ${filePath}`);
        
        // Extract the props type from the closing line
        const propsTypeMatch = lines[j].match(/^\s*}:\s*([A-Za-z0-9_$.]+Props)\s*\)\s*{/);
        const propsType = propsTypeMatch ? propsTypeMatch[1] : "Props";
        
        // Create the fixed function declaration
        const fixedDeclaration = lines[i].replace(/\(\)\s*:\s*React\.ReactNode\s*{/, `({`) + "\n" + 
                                paramLines.join("\n") + "\n" + 
                                `}: ${propsType}): React.ReactNode {`;
        
        // Replace the original lines with the fixed declaration
        lines.splice(i, j - i + 1, fixedDeclaration);
        
        modified = true;
        stats.destructuredSignaturesFixed++;
        console.log(`✅ Fixed destructured parameter list in ${filePath}`);
        
        // Skip ahead to avoid re-processing the same function
        i += 1;
      } else {
        i++;
      }
    } else {
      i++;
    }
  }
  
  if (modified) {
    stats.filesModified++;
    return lines.join("\n");
  }
  
  return content;
}

/**
 * Process a file to fix build errors
 * @param {string} filePath - Path to the file
 */
function processFile(filePath) {
  try {
    stats.filesScanned++;
    console.log(`Scanning file: ${filePath}`);
    
    const content = fs.readFileSync(filePath, "utf8");
    let newContent = content;

    newContent = fixDestructuredParameterLists(filePath, newContent);

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, "utf8");
      console.log(`🛠️ Updated ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing file ${filePath}:`, error);
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

    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".next") {
        scanDirectory(fullPath);
      }
    } else if (FILE_EXTENSIONS.includes(path.extname(entry.name))) {
      processFile(fullPath);
    }
  }
}

// Directly fix known problematic files first
function fixKnownProblematicFiles() {
  const knownFiles = [
    "src/components/about/TeamMember.tsx",
    "src/components/ai/content-transformation/content-transformation-engine.tsx",
    "src/components/ai/curriculum-differentiation/curriculum-differentiation-engine.tsx",
    "src/components/ai/multi-modal-content/multi-modal-presentation-engine.tsx",
    "src/components/ai/progress-pacing/progress-pacing-engine.tsx"
  ];
  
  for (const relativeFilePath of knownFiles) {
    const fullPath = path.join(ROOT_DIR, relativeFilePath);
    if (fs.existsSync(fullPath)) {
      console.log(`🔍 Directly fixing known problematic file: ${fullPath}`);
      processFile(fullPath);
    } else {
      console.warn(`⚠️ Known problematic file not found: ${fullPath}`);
    }
  }
}

// Main execution
console.log("🔧 Starting destructured parameter list fix script...");
console.log(`Scanning from ${ROOT_DIR}`);

try {
  // First fix known problematic files
  fixKnownProblematicFiles();
  
  // Then scan the entire codebase for similar issues
  scanDirectory(path.join(ROOT_DIR, "src"));

  console.log("\n--- Destructured Parameter Fix Statistics ---");
  console.log(`Files scanned: ${stats.filesScanned}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Destructured signatures fixed: ${stats.destructuredSignaturesFixed}`);
  console.log(`Errors encountered: ${stats.errors}`);
  console.log("-------------------------------------------");

  if (stats.errors > 0) {
    console.warn(`⚠️ Script completed with ${stats.errors} errors. Some files may need manual fixes.`);
  } else if (stats.filesModified > 0) {
    console.log("✅ Script completed successfully! All identified destructured parameter errors have been addressed.");
  } else {
    console.log("✅ Script completed. No destructured parameter errors of the specified pattern were found or fixed.");
  }
} catch (error) {
  console.error("❌ Fatal error:", error);
}
