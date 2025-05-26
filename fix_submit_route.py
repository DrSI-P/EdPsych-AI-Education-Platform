#!/usr/bin/env python3

import re
import sys

def fix_typescript_errors(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Fix 1: Fix type annotation in correctOptions declaration
    content = re.sub(r'const correctOptions = question\.correctAnswer as string: any\[\];', 
                    r'const correctOptions = question.correctAnswer as string[];', content)
    
    # Write the fixed content back to the file
    with open(file_path, 'w') as file:
        file.write(content)
    
    print(f"Fixed TypeScript errors in {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/app/api/assessment/[id]/submit/route.ts"
    
    fix_typescript_errors(file_path)
