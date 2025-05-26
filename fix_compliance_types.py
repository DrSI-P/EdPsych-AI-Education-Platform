#!/usr/bin/env python3
"""
Script to fix TypeScript syntax errors in compliance/types.ts
"""

import re
import sys

def fix_compliance_types(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Fix invalid array declarations
    content = re.sub(r'const\s+(\w+)\[\]\s+=\s+\[', r'const \1: any[] = [', content)
    
    # Fix invalid Promise return types
    content = re.sub(r'Promise<([^>]+)>>', r'Promise<\1>', content)
    
    # Fix invalid function return types with extra parentheses
    content = re.sub(r'\(\s*Promise<([^>]+)>\s*\)>', r'Promise<\1>', content)
    
    # Fix invalid type declarations with double colons
    content = re.sub(r'(\w+):\s+(\w+):\s+(\w+)\[\]', r'\1: \3[]', content)
    
    # Fix boolean type with extra angle bracket
    content = re.sub(r'useState<boolean>>', r'useState<boolean>', content)
    
    # Fix void with parentheses
    content = re.sub(r'\(voi\)d', r'void', content)
    
    # Fix interface property declarations
    content = re.sub(r'(\s+)(\w+):\s+(\w+):\s+(\w+);', r'\1\2: \4;', content)
    
    # Fix truncated interface declarations (specific to compliance/types.ts)
    content = re.sub(r'retentionPeriod: DataRe\s*\(Content truncated', r'retentionPeriod: DataRetentionPeriod;\n  };\n}', content)
    
    with open(file_path, 'w') as file:
        file.write(content)
    
    print(f"Fixed TypeScript syntax in {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/lib/compliance/types.ts"
    
    fix_compliance_types(file_path)
