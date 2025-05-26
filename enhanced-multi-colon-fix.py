#!/usr/bin/env python3
"""
Enhanced Multi-Colon Pattern TypeScript Fix Script

This script fixes complex multi-colon and deeply nested TypeScript syntax issues 
that weren't caught by previous scripts. It targets patterns like:
- `Type: SubType: SubSubType: any[]` -> `Type[]`
- Arbitrary-length colon chains in type annotations
- Complex nested interface and function parameter declarations
"""

import os
import re
import sys
from pathlib import Path

# Patterns to fix
PATTERNS = [
    # Fix arbitrary-length colon chains: Type: SubType: SubSubType: any[] -> Type[]
    (r'(\w+)(: \w+)+: any\[\]', r'\1[]'),
    
    # Fix type casting with arbitrary-length chains: as Type: SubType: any[] -> as Type[]
    (r'as (\w+)(: \w+)+: any\[\]', r'as \1[]'),
    
    # Fix function parameters with arbitrary-length chains
    (r'(\(.*?)(\w+): (\w+)(: \w+)+: any\[\](.*?\))', r'\1\2: \3[]\5'),
    
    # Fix complex nested patterns in interfaces with arbitrary-length chains
    (r'(\w+)\?: (\w+)(: \w+)+: any\[\]', r'\1?: \2[]'),
    
    # Fix index signatures in interfaces with better pattern matching
    (r'\[(\w+): (\w+)\]:', r'[\1: \2]:'),
    
    # Fix remaining simple array declarations that might have been missed
    (r'(\s*)(\w+): any\[\];', r'\1\2: any[];'),
    
    # Fix array type assertions
    (r'as any: any\[\]', r'as any[]'),
    
    # Fix array type parameters in generic types
    (r'<(\w+): any\[\]>', r'<\1[]>'),
    
    # Fix array type parameters in function calls
    (r'\((\w+) as (\w+): any\[\]\)', r'(\1 as \2[])'),
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
    
    # Special case for complex interface declarations
    interface_pattern = r'(interface\s+\w+\s*\{[^}]*?)(\w+):\s*(\w+):\s*any\[\];([^}]*?\})'
    while re.search(interface_pattern, content):
        new_content = re.sub(interface_pattern, r'\1\2: \3[];\4', content)
        if new_content != content:
            content = new_content
            modified = True
        else:
            break
    
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
