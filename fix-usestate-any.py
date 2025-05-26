#!/usr/bin/env python3

import os
import re
import glob

# Find all TypeScript files in the src directory
tsx_files = glob.glob('src/**/*.tsx', recursive=True)

# Patterns to fix
patterns = [
    # Fix useState with ': any'
    (r'useState\((.*?): any\)', r'useState(\1)'),
    
    # Fix other React hooks with ': any'
    (r'useRef\((.*?): any\)', r'useRef(\1)'),
    (r'useMemo\((.*?): any\)', r'useMemo(\1)'),
    (r'useCallback\((.*?): any\)', r'useCallback(\1)'),
    
    # Fix useState with type annotation in generic
    (r'useState<[^>]*>\((.*?): any\)', r'useState<\1>(\1)'),
]

# Process each file
for file_path in tsx_files:
    print(f"Processing {file_path}")
    
    # Read file content
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Apply all patterns
    modified = False
    for pattern, replacement in patterns:
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            modified = True
    
    # Write back if modified
    if modified:
        with open(file_path, 'w') as file:
            file.write(content)
        print(f"Fixed {file_path}")

print("Fixed invalid ': any' in useState and React hooks in .tsx files")
