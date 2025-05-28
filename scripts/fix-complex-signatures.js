/**
 * Script to fix complex destructured parameter lists in function signatures,
 * specifically targeting files with default parameter values.
 */

const fs = require("fs");
const path = require("path");

// Root directory
const ROOT_DIR = path.resolve(__dirname, "..");

// List of specific files to fix, identified from the latest build log
const FILES_TO_FIX = [
  "src/components/educator/calendar-optimization.tsx",
  "src/components/enhanced-theme-provider.tsx",
  "src/components/icons/vr-headset.tsx",
  "src/components/immersive/immersive-layout.tsx",
  "src/components/immersive/3d-navigation.tsx"
];

// Counter for statistics
let stats = {
  filesScanned: 0,
  filesModified: 0,
  signaturesFixed: 0,
  errors: 0,
};

/**
 * Fix a specific file with known complex destructured parameter issues.
 * This version will attempt to reconstruct the signature more carefully.
 * @param {string} filePath - Path to the file
 */
function fixComplexSignature(filePath) {
  try {
    stats.filesScanned++;
    console.log(`Processing file: ${filePath}`);
    
    let content = fs.readFileSync(filePath, "utf8");
    let originalContent = content;

    // Regex to find the problematic function signatures
    // export function FunctionName() : ReturnType { prop = default, ... }: PropsType) {
    const signaturePattern = /(\bexport\s+function\s+([A-Za-z0-9_]+)\s*\(\)\s*:\s*([A-Za-z0-9_.:<>]+)\s*{)([\s\S]*?)(^\s*}:\s*([A-Za-z0-9_.:<>]+Props)\s*\)\s*{)/m;

    const match = content.match(signaturePattern);

    if (match) {
      console.log(`Found problematic signature in ${filePath} for function ${match[2]}`);
      const functionDeclarationStart = match[1]; // e.g., "export function CalendarOptimization() : React.ReactNode {"
      const functionName = match[2];
      const returnType = match[3];
      let paramsAndDefaults = match[4].trim(); // The lines between the two parts of the signature
      const propsAndClosing = match[5]; // e.g., "}: CalendarOptimizationProps) {"
      const propsType = match[6];

      // Clean up the paramsAndDefaults string
      // Remove trailing commas from last param if present
      const paramLines = paramsAndDefaults.split("\n").map(line => line.trim()).filter(line => line.length > 0);
      if (paramLines.length > 0 && paramLines[paramLines.length -1].endsWith(",")) {
        paramLines[paramLines.length -1] = paramLines[paramLines.length -1].slice(0, -1);
      }
      paramsAndDefaults = paramLines.join("\n  ");

      // Construct the corrected signature
      const correctedSignature = `export function ${functionName}({
  ${paramsAndDefaults}
}: ${propsType}): ${returnType} {`;
      
      content = content.replace(signaturePattern, correctedSignature);

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, "utf8");
        stats.filesModified++;
        stats.signaturesFixed++;
        console.log(`✅ Fixed complex signature in ${filePath} for function ${functionName}`);
      } else {
        console.log(`⚠️ No changes made to ${filePath} despite match. Original pattern might be too broad or replacement logic flawed.`);
      }
    } else {
      console.log(`⚠️ No complex signature pattern found in ${filePath}. Skipping.`);
    }

  } catch (error) {
    console.error(`❌ Error processing file ${filePath}:`, error);
    stats.errors++;
  }
}

// Main execution
console.log("🔧 Starting targeted fix for complex destructured parameter issues...");

try {
  for (const relativeFilePath of FILES_TO_FIX) {
    const fullPath = path.join(ROOT_DIR, relativeFilePath);
    if (fs.existsSync(fullPath)) {
      fixComplexSignature(fullPath);
    } else {
      console.warn(`⚠️ File not found: ${fullPath}`);
    }
  }

  console.log("\n--- Complex Signature Fix Statistics ---");
  console.log(`Files scanned: ${stats.filesScanned}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Signatures fixed: ${stats.signaturesFixed}`);
  console.log(`Errors encountered: ${stats.errors}`);
  console.log("-------------------------------------------");

  if (stats.errors > 0) {
    console.warn(`⚠️ Script completed with ${stats.errors} errors.`);
  } else if (stats.filesModified > 0) {
    console.log("✅ Script completed successfully! All targeted complex signature errors have been addressed.");
  } else {
    console.log("✅ Script completed. No targeted complex signature errors were found or fixed.");
  }
} catch (error) {
  console.error("❌ Fatal error:", error);
}
