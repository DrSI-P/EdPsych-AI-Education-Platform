#!/usr/bin/env python3
"""
Advanced manual fix script for ai-avatar/types.ts TypeScript errors
This script uses a highly targeted approach to fix the specific syntax errors in the ai-avatar types file
by addressing the complex interface and type declaration issues.
"""

import re
import sys
import os

def fix_ai_avatar_types_advanced(file_path):
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
        
        # Fix trailing semicolons in interface blocks
        content = re.sub(r'(\w+): \{;', r'\1: {', content)
        
        # Fix missing semicolons after property declarations
        content = re.sub(r'(\w+): (\w+)\n', r'\1: \2;\n', content)
        
        # Fix interface property declaration issues
        content = re.sub(r'interface (\w+) \{([^}]*)\}', lambda m: 
                         f'interface {m.group(1)} {{\n' + 
                         re.sub(r'(\w+): ([^;,\n]+)(?!\s*[;,])', r'\1: \2;', m.group(2)) + 
                         '\n}', content)
        
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
        file_path = "/home/ubuntu/edpsych-repo/src/components/ai-avatar/types.ts"
    
    fix_ai_avatar_types_advanced(file_path)
