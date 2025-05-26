#!/usr/bin/env python3

import os
import re
import sys

def fix_type_annotations(content):
    # Fix Type: any[] pattern to Type[]
    pattern1 = r'(\w+): any\[\]'
    replacement1 = r'\1[]'
    content = re.sub(pattern1, replacement1, content)
    
    # Fix Type: Type[] pattern to Type[]
    pattern2 = r'(\w+): (\w+)\[\]'
    replacement2 = r'\1[]'
    content = re.sub(pattern2, replacement2, content)
    
    # Fix function parameters with Type: any[] pattern
    pattern3 = r'(\w+)\[\]'
    replacement3 = r'\1: any[]'
    
    # Only apply this fix to function parameters, not to type declarations
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if 'function' in line and '(' in line and ')' in line:
            # This is a function declaration line
            param_section = line[line.find('(')+1:line.find(')')]
            if param_section and '[' in param_section and ']' in param_section:
                # There's a potential array parameter
                new_param_section = re.sub(pattern3, replacement3, param_section)
                lines[i] = line.replace(param_section, new_param_section)
    
    return '\n'.join(lines)

def process_file(file_path):
    # Skip node_modules directory
    if 'node_modules' in file_path:
        return False
    
    # Only process TypeScript files
    if not (file_path.endswith('.ts') or file_path.endswith('.tsx')):
        return False
    
    try:
        with open(file_path, 'r') as file:
            content = file.read()
        
        # Check if file contains any of the problematic patterns
        if (': any[]' in content or 
            re.search(r'\w+\[\]', content) and 'function' in content):
            
            # Apply fixes
            new_content = fix_type_annotations(content)
            
            # Only write if content changed
            if new_content != content:
                with open(file_path, 'w') as file:
                    file.write(new_content)
                print(f"Fixed: {file_path}")
                return True
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
    
    return False

def process_directory(directory):
    fixed_files = 0
    
    for root, dirs, files in os.walk(directory):
        # Skip node_modules directory
        if 'node_modules' in root:
            continue
            
        for file in files:
            file_path = os.path.join(root, file)
            if process_file(file_path):
                fixed_files += 1
    
    return fixed_files

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python src-only-fix.py <directory>")
        sys.exit(1)
    
    directory = sys.argv[1]
    if not os.path.isdir(directory):
        print(f"Error: {directory} is not a valid directory")
        sys.exit(1)
    
    fixed_files = process_directory(directory)
    print(f"Total files fixed: {fixed_files}")
