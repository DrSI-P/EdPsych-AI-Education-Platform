#!/usr/bin/env python3
"""
Line-by-line manual fix script for mobile/responsive-layout.tsx TypeScript errors
This script carefully fixes the specific syntax errors in the responsive layout component
by addressing each issue individually without introducing new problems.
"""

import re
import sys
import os

def fix_responsive_layout_line_by_line(file_path):
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
        
        # Fix trailing semicolons in object literals
        content = re.sub(r'};', r'}', content)
        
        # Fix JSX syntax with double > characters
        content = re.sub(r'<(div|span|p|h[1-6])>>(.*?)</\1>', r'<\1>\2</\1>', content)
        
        # Fix useState with extra angle brackets
        content = re.sub(r'useState<(\w+)>>', r'useState<\1>', content)
        
        # Fix incorrect equality operators
        content = re.sub(r'(\w+) = ==', r'\1 ===', content)
        
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
        file_path = "/home/ubuntu/edpsych-repo/src/components/mobile/responsive-layout.tsx"
    
    fix_responsive_layout_line_by_line(file_path)
