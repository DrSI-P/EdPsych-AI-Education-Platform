#!/usr/bin/env python3
"""
Enhanced Comprehensive TypeScript Fix Script

This script fixes invalid array property declarations in TypeScript files.
It targets patterns like:
- `property[];` -> `property: any[];`
- `private textQueue[] = [];` -> `private textQueue: any[] = [];`

The script only modifies files in the src directory and avoids node_modules.
"""

import os
import re
import sys
from pathlib import Path

# Patterns to fix
PATTERNS = [
    # Match property[]; -> property: any[];
    (r'(\s*)(\w+)\[\];', r'\1\2: any[];'),
    
    # Match private property[] = []; -> private property: any[] = [];
    (r'(\s*)(private|protected|public)?\s+(\w+)\[\]\s*=', r'\1\2 \3: any[] ='),
    
    # Match function(param[]) -> function(param: any[])
    (r'(\()([^)]*?)(\w+)\[\]([^)]*?\))', r'\1\2\3: any[]\4'),
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

def validate_fixes(directory):
    """Validate that no invalid patterns remain."""
    warnings = []
    
    for root, dirs, files in os.walk(directory):
        # Skip directories in SKIP_FILES
        dirs[:] = [d for d in dirs if d not in SKIP_FILES]
        
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Check for remaining invalid patterns
                    for pattern, _ in PATTERNS:
                        matches = re.findall(pattern, content)
                        if matches:
                            for match in matches:
                                if isinstance(match, tuple):
                                    match_str = ''.join(match)
                                else:
                                    match_str = match
                                warnings.append(f"Warning: {file_path} still contains invalid pattern: {match_str}")
    
    return warnings

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
    
    warnings = validate_fixes(directory)
    if warnings:
        print("\nWarnings:")
        for warning in warnings:
            print(f"  - {warning}")
    else:
        print("\nNo warnings found. All patterns have been fixed.")

if __name__ == "__main__":
    main()
