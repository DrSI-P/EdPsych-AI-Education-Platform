#!/usr/bin/env python3
"""
Batch fix script for avatar/types.ts TypeScript errors
This script fixes the specific syntax errors in the avatar types file
"""

import re
import sys
import os

def fix_avatar_types(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Store the original content for comparison
    original_content = content
    
    # Fix invalid array declarations with double colons
    # Common pattern: property: string: any[] -> property: string[]
    content = re.sub(
        r'(\w+): string: any\[\]',
        r'\1: string[]',
        content
    )
    
    # Fix other property declarations with double colons
    content = re.sub(
        r'(\w+): (\w+): any\[\]',
        r'\1: \2[]',
        content
    )
    
    # Fix interface property declarations
    content = re.sub(
        r'(\w+)\[\];',
        r'\1: any[];',
        content
    )
    
    # Only write if changes were made
    if content != original_content:
        with open(file_path, 'w') as file:
            file.write(content)
        print(f"Fixed TypeScript syntax in {file_path}")
    else:
        print(f"No changes needed for {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/lib/avatar/types.ts"
    
    fix_avatar_types(file_path)
