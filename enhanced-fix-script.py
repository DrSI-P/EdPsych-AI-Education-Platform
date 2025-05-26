#!/usr/bin/env python3

import os
import re
import sys

# Define the pattern to search for and replace
pattern = r'([a-zA-Z0-9_\[\]\.]+)\?: ([a-zA-Z0-9_\[\]\.]+): any\[\]'
replacement = r'\1?: \2[]'

# Additional pattern for the form "any: any[]"
pattern2 = r'([a-zA-Z0-9_\[\]\.]+): any\[\]'
replacement2 = r'\1[]'

# Define directories to search
src_dir = 'src'

# Counter for modified files
modified_files = []

def fix_file(file_path):
    """Fix type annotations in the specified file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if the file contains any of the problematic patterns
    if re.search(pattern, content) or re.search(pattern2, content):
        # Apply the fixes
        new_content = re.sub(pattern, replacement, content)
        new_content = re.sub(pattern2, replacement2, new_content)
        
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

print("\nEnhanced fix script completed.")
