/**
 * Script to fix syntax errors in function signatures
 * 
 * This script addresses errors like: 
 *   `export function TeamMember(: React.ReactNode {`
 * by correcting the function signature to proper TypeScript syntax.
 */

const fs = require("fs");
const path = require("path");

// Root directory to start scanning from
const ROOT_DIR = path.resolve(__dirname, "../src");

// File extensions to process
const FILE_EXTENSIONS = [".tsx", ".jsx"];

// Counter for statistics
let stats = {
  filesScanned: 0,
  filesModified: 0,
  syntaxErrorsFixed: 0,
  errors: 0,
};

/**
 * Fix syntax errors in function signatures
 * @param {string} filePath - Path to the file
 * @param {string} content - File content
 * @returns {string} - Updated file content
 */
function fixFunctionSignatureErrors(filePath, content) {
  let newContent = content;
  let modified = false;

  // Regex to find the incorrect function signature pattern
  // It looks for `function FunctionName(: ReturnType`
  const errorPattern = /(\bexport\s+(?:default\s+)?function\s+[A-Za-z0-9_$]+\s*\()\s*:\s*(React\.ReactNode|JSX\.Element|any|void|string|number|boolean|[^\s{]+)\s*({)/g;

  newContent = newContent.replace(errorPattern, (match, p1, p2, p3) => {
    // p1 is `export function FunctionName(`
    // p2 is the ReturnType
    // p3 is `{`
    // The fix is to move the return type after the closing parenthesis of parameters
    // For now, we assume no parameters were intended before the colon.
    // A more robust solution might try to infer parameters or mark for manual review.
    // Given the specific error, we assume the intent was `function Name() : ReturnType {`
    const correctedSignature = `${p1}) : ${p2} ${p3}`;
    console.log(`✅ Corrected function signature in ${filePath}: ${match} -> ${correctedSignature}`);
    stats.syntaxErrorsFixed++;
    modified = true;
    return correctedSignature;
  });

  if (modified) {
    stats.filesModified++;
  }

  return newContent;
}

/**
 * Process a file to fix build errors
 * @param {string} filePath - Path to the file
 */
function processFile(filePath) {
  try {
    stats.filesScanned++;
    const content = fs.readFileSync(filePath, "utf8");
    let newContent = content;

    newContent = fixFunctionSignatureErrors(filePath, newContent);

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

// Main execution
console.log("🔧 Starting function signature syntax error fix script...");
console.log(`Scanning from ${ROOT_DIR}`);

try {
  scanDirectory(ROOT_DIR);

  console.log("\n--- Syntax Error Fix Statistics ---");
  console.log(`Files scanned: ${stats.filesScanned}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Syntax errors fixed: ${stats.syntaxErrorsFixed}`);
  console.log(`Errors encountered: ${stats.errors}`);
  console.log("-----------------------------------");

  if (stats.errors > 0) {
    console.warn(`⚠️ Script completed with ${stats.errors} errors. Some files may need manual fixes.`);
  } else if (stats.filesModified > 0) {
    console.log("✅ Script completed successfully! All identified syntax errors have been addressed.");
  } else {
    console.log("✅ Script completed. No syntax errors of the specified pattern were found or fixed.");
  }
} catch (error) {
  console.error("❌ Fatal error:", error);
}

