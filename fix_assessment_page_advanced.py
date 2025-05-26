#!/usr/bin/env python3
"""
Advanced fix script for ai-powered-assessment/page.tsx TypeScript errors
This script uses a targeted approach to fix the specific syntax errors in the assessment page file
"""

import re
import sys
import os

def fix_assessment_page_advanced(file_path):
    try:
        with open(file_path, 'r') as file:
            content = file.read()
        
        # Store the original content for comparison
        original_content = content
        
        # Read the file line by line to apply more targeted fixes
        lines = content.split('\n')
        modified_lines = []
        
        for line in lines:
            # Fix invalid array declarations
            if re.search(r'(\w+)\[\];', line):
                line = re.sub(r'(\w+)\[\];', r'\1: any[];', line)
            
            # Fix double colon syntax errors
            if re.search(r'(\w+): (\w+): any\[\]', line):
                line = re.sub(r'(\w+): (\w+): any\[\]', r'\1: \2[]', line)
            
            # Fix function parameter syntax
            if re.search(r'function\s+(\w+)\(([^)]*)\[\]\)', line):
                line = re.sub(r'function\s+(\w+)\(([^)]*)\[\]\)', r'function \1(\2: any[])', line)
            
            # Fix JSX syntax issues with extra angle brackets
            if re.search(r'<(h[1-6])>>(.*?)</\1>', line):
                line = re.sub(r'<(h[1-6])>>(.*?)</\1>', r'<\1>\2</\1>', line)
            
            if re.search(r'<(p)>>(.*?)</\1>', line):
                line = re.sub(r'<(p)>>(.*?)</\1>', r'<\1>\2</\1>', line)
            
            # Fix useState with extra angle brackets
            if re.search(r'useState<(\w+)>>', line):
                line = re.sub(r'useState<(\w+)>>', r'useState<\1>', line)
            
            # Fix arrow function syntax errors
            if re.search(r'\} => \{', line):
                line = re.sub(r'\} => \{', r'} = {', line)
            
            modified_lines.append(line)
        
        # Join the modified lines back into content
        modified_content = '\n'.join(modified_lines)
        
        # Only write if changes were made
        if modified_content != original_content:
            with open(file_path, 'w') as file:
                file.write(modified_content)
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
        file_path = "/home/ubuntu/edpsych-repo/src/app/innovations/ai-powered-assessment/page.tsx"
    
    fix_assessment_page_advanced(file_path)
