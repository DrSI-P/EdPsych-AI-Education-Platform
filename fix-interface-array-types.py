#!/usr/bin/env python3

import os
import re
import glob

# Find all TypeScript files in the src directory
ts_files = glob.glob('src/**/*.ts', recursive=True)
tsx_files = glob.glob('src/**/*.tsx', recursive=True)
all_files = ts_files + tsx_files

# Patterns to fix
def fix_interface_array_types(content):
    # Fix array types in interfaces and type definitions
    # Pattern 1: property?: type[];
    content = re.sub(r'(\w+\??)\[\];', r'\1: any[];', content)
    
    # Pattern 2: { property[] }
    content = re.sub(r'(\w+)\[\]([,\s}])', r'\1: any[]\2', content)
    
    # Pattern 3: extends (...args[])
    content = re.sub(r'\(\s*\.\.\.\s*(\w+)\[\]\s*\)', r'(...\1: any[])', content)
    
    # Pattern 4: (items[]) => void
    content = re.sub(r'\(\s*(\w+)\[\]\s*\)', r'(\1: any[])', content)
    
    return content

# Process each file
for file_path in all_files:
    try:
        with open(file_path, 'r') as file:
            content = file.read()
        
        # Check if file contains invalid array type syntax
        if re.search(r'(\w+\??)\[\];', content) or re.search(r'(\w+)\[\]([,\s}])', content) or re.search(r'\(\s*\.\.\.\s*(\w+)\[\]\s*\)', content) or re.search(r'\(\s*(\w+)\[\]\s*\)', content):
            print(f"Processing {file_path}")
            modified_content = fix_interface_array_types(content)
            
            # Write back if modified
            if modified_content != content:
                with open(file_path, 'w') as file:
                    file.write(modified_content)
                print(f"Fixed array types in {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

print("Fixed invalid array typings in interface and object property definitions")
