#!/usr/bin/env python3
"""
Advanced batch fix script for ai-avatar/types.ts TypeScript errors
This script uses a more targeted approach to fix the specific syntax errors in the AI avatar types file
"""

import re
import sys
import os

def fix_ai_avatar_types_advanced(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Store the original content for comparison
    original_content = content
    
    # Read the file line by line to apply more targeted fixes
    lines = content.split('\n')
    modified_lines = []
    
    for line in lines:
        # Fix invalid array declarations with double colons
        if re.search(r'(\w+): string: any\[\]', line):
            line = re.sub(r'(\w+): string: any\[\]', r'\1: string[]', line)
        
        # Fix other property declarations with double colons
        if re.search(r'(\w+): (\w+): any\[\]', line):
            line = re.sub(r'(\w+): (\w+): any\[\]', r'\1: \2[]', line)
        
        # Fix interface property declarations
        if re.search(r'(\w+)\[\];', line):
            line = re.sub(r'(\w+)\[\];', r'\1: any[];', line)
        
        # Fix function parameter syntax
        if re.search(r'function\s+(\w+)\(([^)]*)\[\]\)', line):
            line = re.sub(r'function\s+(\w+)\(([^)]*)\[\]\)', r'function \1(\2: any[])', line)
        
        # Fix specific patterns found in ai-avatar/types.ts
        if re.search(r'voiceOptions\[\]', line):
            line = re.sub(r'voiceOptions\[\]', r'voiceOptions: any[]', line)
        
        if re.search(r'animationOptions\[\]', line):
            line = re.sub(r'animationOptions\[\]', r'animationOptions: any[]', line)
        
        if re.search(r'customizationOptions\[\]', line):
            line = re.sub(r'customizationOptions\[\]', r'customizationOptions: any[]', line)
        
        modified_lines.append(line)
    
    # Join the modified lines back into content
    modified_content = '\n'.join(modified_lines)
    
    # Only write if changes were made
    if modified_content != original_content:
        with open(file_path, 'w') as file:
            file.write(modified_content)
        print(f"Fixed TypeScript syntax in {file_path}")
    else:
        print(f"No changes needed for {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/components/ai-avatar/types.ts"
    
    fix_ai_avatar_types_advanced(file_path)
