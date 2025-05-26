#!/usr/bin/env python3
"""
Advanced manual fix script for custom-report-builder.tsx
This script uses a more careful approach to fix TypeScript syntax errors
in complex React components with intricate type structures.
"""

import re
import sys

def fix_custom_report_builder_manual(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Store the original content for comparison
    original_content = content
    
    # Fix interface and type declarations with a more targeted approach
    # Process each interface/type block individually
    interface_pattern = r'(interface|type)\s+(\w+)\s*\{([^}]*)\}'
    
    def fix_interface(match):
        interface_type = match.group(1)
        name = match.group(2)
        body = match.group(3)
        
        # Fix property declarations with array syntax
        body = re.sub(r'(\s+)(\w+)\[\];', r'\1\2: any[];', body)
        
        # Fix invalid type declarations with double colons
        body = re.sub(r'(\s+)(\w+):\s+(\w+):\s+(\w+)\[\]', r'\1\2: \4[];', body)
        
        # Fix interface property declarations with double colons
        body = re.sub(r'(\s+)(\w+):\s+(\w+):\s+(\w+);', r'\1\2: \4;', body)
        
        return f"{interface_type} {name} {{{body}}}"
    
    content = re.sub(interface_pattern, fix_interface, content, flags=re.DOTALL)
    
    # Fix function declarations and return types
    function_pattern = r'(function|const)\s+(\w+)(?:\s*=\s*(?:async\s*)?\([^)]*\))?\s*(?::\s*([^{]+))?\s*{'
    
    def fix_function(match):
        func_type = match.group(1)
        name = match.group(2)
        return_type = match.group(3)
        
        if return_type:
            # Fix return types with extra angle brackets
            return_type = re.sub(r'Promise<([^>]+)>>', r'Promise<\1>', return_type)
            # Fix return types with extra parentheses
            return_type = re.sub(r'\(\s*Promise<([^>]+)>\s*\)', r'Promise<\1>', return_type)
            return f"{func_type} {name}: {return_type} {{"
        else:
            return match.group(0)
    
    content = re.sub(function_pattern, fix_function, content)
    
    # Fix variable declarations with array syntax
    content = re.sub(r'(const|let|var)\s+(\w+)\[\]\s+=\s+\[', r'\1 \2: any[] = [', content)
    
    # Fix property declarations with array syntax outside interfaces
    content = re.sub(r'(\w+)\[\]\s*=\s*([^;]+);', r'\1: any[] = \2;', content)
    
    # Fix missing semicolons carefully (only where clearly needed)
    # This is a more targeted approach to avoid breaking JSX
    def fix_semicolons(match):
        line = match.group(0)
        if '<' in line or '>' in line:  # Likely JSX, don't modify
            return line
        return line + ';'
    
    content = re.sub(r'(\w+)\s*=\s*([^;\n{]+)$', fix_semicolons, content, flags=re.MULTILINE)
    
    # Fix invalid element access expressions without breaking JSX
    def fix_element_access(match):
        if '<' in match.group(0) or '>' in match.group(0):  # Likely JSX, don't modify
            return match.group(0)
        return match.group(1)  # Remove the empty brackets
    
    content = re.sub(r'(\w+)\[\](?!\s*=)', fix_element_access, content)
    
    # Only write if changes were made
    if content != original_content:
        with open(file_path, 'w') as file:
            file.write(content)
        print(f"Fixed TypeScript syntax in {file_path} with manual targeted approach")
    else:
        print(f"No changes needed for {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/components/analytics/custom-report-builder.tsx"
    
    fix_custom_report_builder_manual(file_path)
