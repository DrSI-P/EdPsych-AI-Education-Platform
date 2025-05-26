#!/usr/bin/env python3

import os
import re
import sys

def find_typescript_files(directory):
    """Find all TypeScript and TSX files in the given directory and its subdirectories."""
    ts_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx'):
                ts_files.append(os.path.join(root, file))
    return ts_files

def fix_type_annotations(file_path):
    """Fix problematic type annotations in the given file."""
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Original pattern: Fix Type: any[] to Type[]
    original_pattern = r'(\w+): any\[\]'
    fixed_content = re.sub(original_pattern, r'\1[]', content)
    
    # Enhanced pattern: Fix Type: Type: any[] to Type: Type[]
    enhanced_pattern = r'(\w+): (\w+): any\[\]'
    fixed_content = re.sub(enhanced_pattern, r'\1: \2[]', fixed_content)
    
    # Additional pattern: Fix useState<Type: any[]> to useState<Type[]>
    useState_pattern = r'useState<(\w+): any\[\]>'
    fixed_content = re.sub(useState_pattern, r'useState<\1[]>', fixed_content)
    
    # Check if any changes were made
    if content != fixed_content:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(fixed_content)
        return True
    return False

def main():
    """Main function to find and fix TypeScript files."""
    if len(sys.argv) > 1:
        directory = sys.argv[1]
    else:
        directory = '.'
    
    ts_files = find_typescript_files(directory)
    fixed_files = []
    
    for file_path in ts_files:
        if fix_type_annotations(file_path):
            fixed_files.append(file_path)
    
    print(f"Fixed {len(fixed_files)} files:")
    for file in fixed_files:
        print(f"  - {file}")

if __name__ == "__main__":
    main()
