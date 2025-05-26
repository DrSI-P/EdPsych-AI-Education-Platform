#!/usr/bin/env python3

import re
import sys

def fix_typescript_errors(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Fix 1: Fix array type declaration in bulkDelete function
    content = re.sub(r'bulkDelete\(model: string, ids\[\]\):', r'bulkDelete(model: string, ids: string[]):', content)
    
    # Fix 2: Fix any type declaration in DatabaseError class
    content = re.sub(r'details\?;', r'details?: any;', content)
    
    # Write the fixed content back to the file
    with open(file_path, 'w') as file:
        file.write(content)
    
    print(f"Fixed TypeScript errors in {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/lib/db-utils.ts"
    
    fix_typescript_errors(file_path)
