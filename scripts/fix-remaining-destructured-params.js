/**
 * Script to fix remaining destructured parameter lists in function signatures
 * 
 * This script directly targets the specific files that still have syntax errors
 * with destructured parameters appearing after the function declaration instead
 * of inside the parentheses.
 */

const fs = require("fs");
const path = require("path");

// Root directory
const ROOT_DIR = path.resolve(__dirname, "..");

// List of specific files to fix
const FILES_TO_FIX = [
  "src/components/ai/content-transformation/content-transformation-engine.tsx",
  "src/components/ai/curriculum-differentiation/curriculum-differentiation-engine.tsx",
  "src/components/ai/multi-modal-content/multi-modal-presentation-engine.tsx",
  "src/components/ai/progress-pacing/progress-pacing-engine.tsx",
  "src/components/ai/speech-recognition/advanced-speech-recognition.tsx"
];

// Counter for statistics
let stats = {
  filesScanned: 0,
  filesModified: 0,
  destructuredSignaturesFixed: 0,
  errors: 0,
};

/**
 * Fix a specific file with known destructured parameter issues
 * @param {string} filePath - Path to the file
 */
function fixSpecificFile(filePath) {
  try {
    stats.filesScanned++;
    console.log(`Processing file: ${filePath}`);
    
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    
    // Find the function declaration line
    let functionStartLine = -1;
    let functionEndLine = -1;
    let functionName = "";
    let returnType = "";
    let propsType = "";
    let paramLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      // Look for export function Name() : ReturnType {
      const funcDeclMatch = lines[i].match(/^(\s*export\s+(?:default\s+)?function\s+([A-Za-z0-9_$]+)\s*\(\)\s*:\s*([A-Za-z0-9_$.]+)\s*{)\s*$/);
      
      if (funcDeclMatch) {
        functionStartLine = i;
        functionName = funcDeclMatch[2];
        returnType = funcDeclMatch[3];
        console.log(`Found function declaration: ${functionName} at line ${i}`);
        
        // Collect parameter lines until we find the closing pattern
        let j = i + 1;
        paramLines = [];
        
        while (j < lines.length) {
          // Check if this line contains the closing pattern }: PropsType) {
          if (lines[j].match(/^\s*}:\s*([A-Za-z0-9_$.]+Props)\s*\)\s*{/)) {
            functionEndLine = j;
            propsType = lines[j].match(/^\s*}:\s*([A-Za-z0-9_$.]+Props)\s*\)\s*{/)[1];
            break;
          }
          
          // Add this line to parameter lines
          paramLines.push(lines[j]);
          j++;
        }
        
        if (functionEndLine > functionStartLine) {
          break; // Found the complete function signature
        }
      }
    }
    
    // If we found a function with the error pattern
    if (functionStartLine >= 0 && functionEndLine > functionStartLine) {
      console.log(`Found complete function with error pattern: ${functionName}`);
      
      // Create the fixed function declaration
      const fixedDeclaration = `export function ${functionName}({`;
      
      // Create the fixed function closing
      const fixedClosing = `}: ${propsType}): ${returnType} {`;
      
      // Replace the original lines
      lines[functionStartLine] = fixedDeclaration;
      lines[functionEndLine] = fixedClosing;
      
      // Write the fixed content back to the file
      fs.writeFileSync(filePath, lines.join("\n"), "utf8");
      
      stats.filesModified++;
      stats.destructuredSignaturesFixed++;
      console.log(`✅ Fixed function signature in ${filePath}`);
    } else {
      console.log(`⚠️ Could not find the expected error pattern in ${filePath}`);
      
      // Try a more direct approach for this specific file
      let modified = false;
      
      // For content-transformation-engine.tsx
      if (filePath.includes("content-transformation-engine.tsx")) {
        const regex = /export function ContentTransformationEngine\(\) : React\.ReactNode {[\s\S]+?}: ContentTransformationProps\) {/g;
        const replacement = `export function ContentTransformationEngine({
  originalContent = '',
  customContent = '',
  targetAge = 10,
  learningStyle,
  onTransformationComplete
}: ContentTransformationProps): React.ReactNode {`;
        
        const newContent = content.replace(regex, replacement);
        if (newContent !== content) {
          fs.writeFileSync(filePath, newContent, "utf8");
          modified = true;
          console.log(`✅ Directly fixed ContentTransformationEngine`);
        }
      }
      
      // For curriculum-differentiation-engine.tsx
      else if (filePath.includes("curriculum-differentiation-engine.tsx")) {
        const regex = /export function CurriculumDifferentiationEngine\(\) : React\.ReactNode {[\s\S]+?}: CurriculumDifferentiationEngineProps\) {/g;
        const replacement = `export function CurriculumDifferentiationEngine({
  curriculumContent = '',
  subject = '',
  year = '',
  onDifferentiationGenerated,
  className
}: CurriculumDifferentiationEngineProps): React.ReactNode {`;
        
        const newContent = content.replace(regex, replacement);
        if (newContent !== content) {
          fs.writeFileSync(filePath, newContent, "utf8");
          modified = true;
          console.log(`✅ Directly fixed CurriculumDifferentiationEngine`);
        }
      }
      
      // For multi-modal-presentation-engine.tsx
      else if (filePath.includes("multi-modal-presentation-engine.tsx")) {
        const regex = /export function MultiModalPresentationEngine\(\) : React\.ReactNode {[\s\S]+?}: MultiModalPresentationEngineProps\) {/g;
        const replacement = `export function MultiModalPresentationEngine({
  content = '',
  contentType = 'text',
  contentId,
  onContentGenerated,
  className
}: MultiModalPresentationEngineProps): React.ReactNode {`;
        
        const newContent = content.replace(regex, replacement);
        if (newContent !== content) {
          fs.writeFileSync(filePath, newContent, "utf8");
          modified = true;
          console.log(`✅ Directly fixed MultiModalPresentationEngine`);
        }
      }
      
      // For progress-pacing-engine.tsx
      else if (filePath.includes("progress-pacing-engine.tsx")) {
        const regex = /export function ProgressPacingEngine\(\) : React\.ReactNode {[\s\S]+?}: ProgressPacingEngineProps\) {/g;
        const replacement = `export function ProgressPacingEngine({
  studentData,
  curriculumData,
  initialPacingData,
  onPacingAdjusted,
  className
}: ProgressPacingEngineProps): React.ReactNode {`;
        
        const newContent = content.replace(regex, replacement);
        if (newContent !== content) {
          fs.writeFileSync(filePath, newContent, "utf8");
          modified = true;
          console.log(`✅ Directly fixed ProgressPacingEngine`);
        }
      }
      
      // For advanced-speech-recognition.tsx
      else if (filePath.includes("advanced-speech-recognition.tsx")) {
        const regex = /export function AdvancedSpeechRecognition\(\) : React\.ReactNode {[\s\S]+?}: SpeechRecognitionProps\) {/g;
        const replacement = `export function AdvancedSpeechRecognition({
  onTranscriptionComplete,
  onInterimTranscription,
  language = 'en-GB',
  continuous = true,
  autoStart = false,
  childVoiceOptimization = true,
  showCalibration = false,
  className = '',
}: SpeechRecognitionProps): React.ReactNode {`;
        
        const newContent = content.replace(regex, replacement);
        if (newContent !== content) {
          fs.writeFileSync(filePath, newContent, "utf8");
          modified = true;
          console.log(`✅ Directly fixed AdvancedSpeechRecognition`);
        }
      }
      
      if (modified) {
        stats.filesModified++;
        stats.destructuredSignaturesFixed++;
      }
    }
  } catch (error) {
    console.error(`❌ Error processing file ${filePath}:`, error);
    stats.errors++;
  }
}

// Main execution
console.log("🔧 Starting targeted fix for remaining destructured parameter issues...");

try {
  // Process each file in the list
  for (const relativeFilePath of FILES_TO_FIX) {
    const fullPath = path.join(ROOT_DIR, relativeFilePath);
    if (fs.existsSync(fullPath)) {
      console.log(`🔍 Processing file: ${fullPath}`);
      fixSpecificFile(fullPath);
    } else {
      console.warn(`⚠️ File not found: ${fullPath}`);
    }
  }

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
