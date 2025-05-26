#!/usr/bin/env python3

import os
import re
import sys

# Define the patterns to search for and replace
patterns = [
    # Pattern 1: Type: any[] -> Type[]
    (r'([a-zA-Z0-9_\[\]\.]+): any\[\]', r'\1[]'),
    
    # Pattern 2: Type?: Type: any[] -> Type?: Type[]
    (r'([a-zA-Z0-9_\[\]\.]+)\?: ([a-zA-Z0-9_\[\]\.]+): any\[\]', r'\1?: \2[]'),
    
    # Pattern 3: Record<Type, Type: any[]> -> Record<Type, Type[]>
    (r'Record<([a-zA-Z0-9_\[\]\.]+), ([a-zA-Z0-9_\[\]\.]+): any\[\]>', r'Record<\1, \2[]>'),
    
    # Pattern 4: Map<Type, Type: any[]> -> Map<Type, Type[]>
    (r'Map<([a-zA-Z0-9_\[\]\.]+), ([a-zA-Z0-9_\[\]\.]+): any\[\]>', r'Map<\1, \2[]>'),
    
    # Pattern 5: Promise<Type: any[]> -> Promise<Type[]>
    (r'Promise<([a-zA-Z0-9_\[\]\.]+): any\[\]>', r'Promise<\1[]>'),
    
    # Pattern 6: Array<Type: any[]> -> Array<Type[]>
    (r'Array<([a-zA-Z0-9_\[\]\.]+): any\[\]>', r'Array<\1[]>'),
]

# Define directories to search
src_dir = 'src'

# Counter for modified files
modified_files = []

def fix_file(file_path):
    """Fix type annotations in the specified file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if the file contains any of the problematic patterns
    needs_fix = False
    for pattern, _ in patterns:
        if re.search(pattern, content):
            needs_fix = True
            break
    
    if needs_fix:
        # Apply all the fixes
        new_content = content
        for pattern, replacement in patterns:
            new_content = re.sub(pattern, replacement, new_content)
        
        # Write the fixed content back to the file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        modified_files.append(file_path)
        print(f"Fixed: {file_path}")
        return True
    
    return False

def scan_directory(directory):
    """Recursively scan directory for TypeScript files and fix them."""
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx'):
                file_path = os.path.join(root, file)
                fix_file(file_path)

# Main execution
print(f"Scanning {src_dir} directory for TypeScript files...")
scan_directory(src_dir)

print(f"\nTotal files fixed: {len(modified_files)}")
for file in modified_files:
    print(f"  - {file}")

print("\nEnhanced comprehensive fix script completed.")
