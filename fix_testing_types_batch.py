#!/usr/bin/env python3
"""
Batch fix script for testing/types.ts TypeScript errors
This script fixes the specific syntax errors in testing/types.ts file
"""

import re
import sys
import os

def fix_testing_types(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Store the original content for comparison
    original_content = content
    
    # Fix invalid type declarations with double colons
    # Error: specialEducationalNeeds?: string: any[] -> specialEducationalNeeds?: string[]
    content = re.sub(
        r'specialEducationalNeeds\?: string: any\[\]',
        r'specialEducationalNeeds?: string[]',
        content
    )
    
    # Error: curriculumAlignment?: string: any[] -> curriculumAlignment?: string[]
    content = re.sub(
        r'curriculumAlignment\?: string: any\[\]',
        r'curriculumAlignment?: string[]',
        content
    )
    
    # Fix other similar double colon patterns
    content = re.sub(
        r'(\w+)\?: string: any\[\]',
        r'\1?: string[]',
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
        file_path = "/home/ubuntu/edpsych-repo/src/lib/testing/types.ts"
    
    fix_testing_types(file_path)
