#!/usr/bin/env python3
"""
Script to fix TypeScript syntax errors in ai-powered-assessment/page.tsx
"""

import re
import sys

def fix_assessment_page(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Fix invalid array declarations
    content = re.sub(r'const\s+(\w+)\[\]\s+=\s+\[', r'const \1: any[] = [', content)
    
    # Fix missing semicolons
    content = re.sub(r'(\w+)\s*=\s*([^;]+)(?!\s*[;{])\s*\n', r'\1 = \2;\n', content)
    
    # Fix invalid element access expressions
    content = re.sub(r'(\w+)\[\](?!\s*=)', r'\1', content)
    
    # Fix missing commas in object literals
    content = re.sub(r'(\s+)(\w+):\s*([^,{}\n]+)(?!\s*[,}])\s*\n\s+(\w+)', r'\1\2: \3,\n\1\4', content)
    
    # Fix property or signature expected errors
    content = re.sub(r'(\w+):\s+(\w+):\s+(\w+)\[\]', r'\1: \3[]', content)
    
    with open(file_path, 'w') as file:
        file.write(content)
    
    print(f"Fixed TypeScript syntax in {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/app/innovations/ai-powered-assessment/page.tsx"
    
    fix_assessment_page(file_path)
