#!/usr/bin/env python3
"""
Line-by-line manual fix script for avatar/types.ts TypeScript errors
This script carefully fixes the specific syntax errors in the avatar types file
by addressing each issue individually without introducing new problems.
"""

import re
import sys
import os

def fix_avatar_types_line_by_line(file_path):
    try:
        with open(file_path, 'r') as file:
            content = file.read()
        
        # Store the original content for comparison
        original_content = content
        
        # Fix invalid array declarations
        content = re.sub(r'(\w+)\[\]', r'\1: any[]', content)
        
        # Fix double colon syntax errors
        content = re.sub(r'(\w+): (\w+): any\[\]', r'\1: \2[]', content)
        
        # Fix trailing commas in interface properties
        content = re.sub(r'(\w+): (\w+);,', r'\1: \2;', content)
        
        # Fix missing semicolons after property declarations
        content = re.sub(r'(\w+): (\w+)\n', r'\1: \2;\n', content)
        
        # Fix interface property declaration issues
        content = re.sub(r'interface (\w+) \{([^}]*)\}', lambda m: 
                         f'interface {m.group(1)} {{\n' + 
                         re.sub(r'(\w+): ([^;,\n]+)(?!\s*[;,])', r'\1: \2;', m.group(2)) + 
                         '\n}', content)
        
        # Fix escaped single quotes in enums
        content = re.sub(r"= \\'([A-Z_]+)\\'", r"= '\1'", content)
        
        # Only write if changes were made
        if content != original_content:
            with open(file_path, 'w') as file:
                file.write(content)
            print(f"Fixed TypeScript syntax in {file_path}")
            return True
        else:
            print(f"No changes needed for {file_path}")
            return False
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/lib/avatar/types.ts"
    
    fix_avatar_types_line_by_line(file_path)
