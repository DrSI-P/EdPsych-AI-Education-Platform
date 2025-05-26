#!/usr/bin/env python3
"""
Critical fix script for theme-provider.tsx
This script fixes the specific syntax error identified in the Vercel build log
"""

import re
import sys

def fix_theme_provider(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Store the original content for comparison
    original_content = content
    
    # Fix the specific error identified in the build log
    # Error: export function cn(...inputs[]) -> export function cn(...inputs: any[])
    content = re.sub(
        r'export function cn\(\.\.\.(inputs)\[\]\)',
        r'export function cn(...\1: any[])',
        content
    )
    
    # Only write if changes were made
    if content != original_content:
        with open(file_path, 'w') as file:
            file.write(content)
        print(f"Fixed critical TypeScript syntax in {file_path}")
    else:
        print(f"No changes needed for {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/components/theme-provider.tsx"
    
    fix_theme_provider(file_path)
