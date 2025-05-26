#!/usr/bin/env python3

import re
import sys

def fix_typescript_errors(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Fix 1: Fix array type declarations in issues
    content = re.sub(r'issues\[\];', r'issues: CurriculumIssue[];', content)
    
    # Fix 2: Fix array type declarations in passedChecks
    content = re.sub(r'passedChecks\[\];', r'passedChecks: string[];', content)
    
    # Fix 3: Fix array type declarations in validationResults
    content = re.sub(r'validationResults\[\]', r'validationResults: CurriculumValidationResult[]', content)
    
    # Fix 4: Fix array type declarations in issues array
    content = re.sub(r'issues\[\]', r'issues: CurriculumIssue[]', content)
    
    # Write the fixed content back to the file
    with open(file_path, 'w') as file:
        file.write(content)
    
    print(f"Fixed TypeScript errors in {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/components/i18n/multilingual-curriculum-validator.tsx"
    
    fix_typescript_errors(file_path)
