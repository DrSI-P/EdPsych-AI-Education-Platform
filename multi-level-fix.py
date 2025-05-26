#!/usr/bin/env python3
"""
Multi-Level Edge Case TypeScript Fix Script

This script fixes complex multi-level edge case TypeScript syntax issues that weren't caught by previous scripts.
It targets patterns like:
- `Type: SubType: any[]` -> `Type[]`
- Nested interface and function parameter declarations with multiple colons
"""

import os
import re
import sys
from pathlib import Path

# Patterns to fix
PATTERNS = [
    # Fix triple colon syntax: Type: SubType: any[] -> Type[]
    (r'(\w+): (\w+): any\[\]', r'\1[]'),
    
    # Fix function parameters with triple colon: (param: Type: SubType: any[]) -> (param: Type[])
    (r'(\(.*?)(\w+): (\w+): (\w+): any\[\](.*?\))', r'\1\2: \3[]\5'),
    
    # Fix complex nested patterns in interfaces and function parameters with multiple colons
    (r'(\w+)\?: (\w+): (\w+): any\[\]', r'\1?: \2[]'),
    
    # Fix index signatures in interfaces
    (r'\[(\w+): (\w+)\]: \{', r'[\1: \2]: {'),
    
    # Fix remaining double colon syntax that might have been missed
    (r'(\w+): (\w+): any\[\]', r'\1: \2[]'),
]

# Files to skip (if any)
SKIP_FILES = [
    "node_modules",
    ".git",
    "dist",
    "build",
]

def fix_file(file_path):
    """Fix TypeScript syntax issues in a file."""
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original_content = content
    modified = False
    
    for pattern, replacement in PATTERNS:
        new_content = re.sub(pattern, replacement, content)
        if new_content != content:
            content = new_content
            modified = True
    
    if modified:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Fixed: {file_path}")
        return True
    
    return False

def scan_directory(directory):
    """Scan directory for TypeScript files and fix them."""
    fixed_files = []
    
    for root, dirs, files in os.walk(directory):
        # Skip directories in SKIP_FILES
        dirs[:] = [d for d in dirs if d not in SKIP_FILES]
        
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                file_path = os.path.join(root, file)
                if fix_file(file_path):
                    fixed_files.append(file_path)
    
    return fixed_files

def main():
    """Main function."""
    if len(sys.argv) > 1:
        directory = sys.argv[1]
    else:
        directory = os.path.join(os.getcwd(), 'src')
    
    print(f"Scanning directory: {directory}")
    fixed_files = scan_directory(directory)
    
    print(f"\nFixed {len(fixed_files)} files:")
    for file in fixed_files:
        print(f"  - {file}")

if __name__ == "__main__":
    main()
