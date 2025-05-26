#!/usr/bin/env python3

import re
import sys

def fix_typescript_errors(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Fix 1: Fix array type declarations in metrics object
    content = re.sub(r'\[key: string\];', r'[key: string]: number;', content)
    
    # Fix 2: Fix array type declarations in strengths
    content = re.sub(r'conceptsStrong\[\];', r'conceptsStrong: string[];', content)
    
    # Fix 3: Fix array type declarations in areasForImprovement
    content = re.sub(r'conceptsToImprove\[\];', r'conceptsToImprove: string[];', content)
    content = re.sub(r'suggestedActivities\[\];', r'suggestedActivities: string[];', content)
    
    # Fix 4: Fix array type declarations in nextSteps
    content = re.sub(r'nextSteps\[\];', r'nextSteps: string[];', content)
    
    # Write the fixed content back to the file
    with open(file_path, 'w') as file:
        file.write(content)
    
    print(f"Fixed TypeScript errors in {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/lib/ai/guidanceTypes.ts"
    
    fix_typescript_errors(file_path)
