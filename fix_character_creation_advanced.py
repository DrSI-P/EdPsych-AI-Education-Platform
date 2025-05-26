#!/usr/bin/env python3
"""
Advanced script to fix TypeScript syntax errors in character-creation.tsx
with more targeted and careful approach for complex components
"""

import re
import sys

def fix_character_creation_advanced(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # First, identify and fix interface or type declarations
    interface_pattern = r'(interface|type)\s+(\w+)\s*\{([^}]*)\}'
    
    def fix_interface(match):
        interface_type = match.group(1)
        name = match.group(2)
        body = match.group(3)
        
        # Fix property declarations with array syntax
        body = re.sub(r'(\s+)(\w+)\[\];', r'\1\2: any[];', body)
        
        # Fix invalid type declarations with double colons
        body = re.sub(r'(\w+):\s+(\w+):\s+(\w+)\[\]', r'\1: \3[];', body)
        
        # Fix interface property declarations
        body = re.sub(r'(\s+)(\w+):\s+(\w+):\s+(\w+);', r'\1\2: \4;', body)
        
        return f"{interface_type} {name} {{{body}}}"
    
    content = re.sub(interface_pattern, fix_interface, content, flags=re.DOTALL)
    
    # Fix invalid array declarations in variable assignments
    content = re.sub(r'(const|let|var)\s+(\w+)\[\]\s+=\s+\[', r'\1 \2: any[] = [', content)
    
    # Fix property declarations with array syntax outside interfaces
    content = re.sub(r'(\w+)\[\]\s*=\s*([^;]+);', r'\1: any[] = \2;', content)
    
    # Fix missing semicolons carefully (only where clearly needed)
    content = re.sub(r'(\w+)\s*=\s*([^;\n{]+)$', r'\1 = \2;', content, flags=re.MULTILINE)
    
    # Fix invalid element access expressions without breaking JSX
    def fix_element_access(match):
        if '<' in match.group(0) or '>' in match.group(0):  # Likely JSX, don't modify
            return match.group(0)
        return match.group(1)  # Remove the empty brackets
    
    content = re.sub(r'(\w+)\[\](?!\s*=)', fix_element_access, content)
    
    # Fix function return types with extra parentheses
    content = re.sub(r':\s*\(\s*Promise<([^>]+)>\s*\)>', r': Promise<\1>', content)
    content = re.sub(r':\s*\(\s*void\s*\)', r': void', content)
    
    # Fix void with parentheses
    content = re.sub(r'\(voi\)d', r'void', content)
    
    with open(file_path, 'w') as file:
        file.write(content)
    
    print(f"Fixed TypeScript syntax in {file_path} with advanced targeted approach")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/components/adventure-quest/character-creation.tsx"
    
    fix_character_creation_advanced(file_path)
