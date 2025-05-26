#!/usr/bin/env python3
"""
Batch fix script for utils.ts TypeScript errors
This script fixes the specific syntax errors in utils.ts file
"""

import re
import sys
import os

def fix_utils_ts(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Store the original content for comparison
    original_content = content
    
    # Fix invalid function parameter syntax
    # Error: export function cn(...inputs[]): string -> export function cn(...inputs: any[]): string
    content = re.sub(
        r'export function cn\(\.\.\.(inputs)\[\]\)',
        r'export function cn(...\1: any[])',
        content
    )
    
    # Fix other similar function parameter syntax
    # Error: function debounce<T extends (...args[]) => any> -> function debounce<T extends (...args: any[]) => any>
    content = re.sub(
        r'extends \(\.\.\.(args)\[\]\)',
        r'extends (...\1: any[])',
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
        file_path = "/home/ubuntu/edpsych-repo/src/lib/utils.ts"
    
    fix_utils_ts(file_path)
