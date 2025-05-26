#!/usr/bin/env python3
"""
Advanced targeted fix script for app/innovations/ai-powered-assessment/page.tsx
This script applies precise fixes to address TypeScript errors in this complex file
"""

import re
import sys

def fix_ai_assessment_page(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Store the original content for comparison
    original_content = content
    
    # Fix interface and type declarations with a more targeted approach
    interface_pattern = r'(interface|type)\s+(\w+)\s*\{([^}]*)\}'
    
    def fix_interface(match):
        interface_type = match.group(1)
        name = match.group(2)
        body = match.group(3)
        
        # Fix property declarations with array syntax
        body = re.sub(r'(\s+)(\w+)\[\];', r'\1\2: any[];', body)
        
        # Fix invalid type declarations with double colons
        body = re.sub(r'(\w+):\s+(\w+):\s+(\w+)\[\]', r'\1: \3[];', body)
        
        # Fix interface property declarations with double colons
        body = re.sub(r'(\s+)(\w+):\s+(\w+):\s+(\w+);', r'\1\2: \4;', body)
        
        # Fix missing semicolons in interface properties
        body = re.sub(r'(\s+)(\w+):\s+([^;\n]+)(?!\s*[;{])\s*\n', r'\1\2: \3;\n', body)
        
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
    
    # Fix function parameter types
    content = re.sub(r'(\w+):\s*\(([^)]+)\[\]\)', r'\1: (\2: any[])', content)
    
    # Fix missing type annotations in function parameters
    content = re.sub(r'(\w+)\s*\(\s*(\w+)\[\]', r'\1(\2: any[]', content)
    
    # Fix JSX component props with array syntax
    # This is a careful pattern to avoid breaking JSX
    def fix_jsx_props(match):
        full_match = match.group(0)
        if '<' in full_match or '>' in full_match:  # Likely JSX
            return full_match.replace('[]', ': any[]')
        return full_match
    
    content = re.sub(r'(\w+)=\{([^}]+)\[\]\}', fix_jsx_props, content)
    
    # Only write if changes were made
    if content != original_content:
        with open(file_path, 'w') as file:
            file.write(content)
        print(f"Fixed TypeScript syntax in {file_path} with advanced targeted approach")
    else:
        print(f"No changes needed for {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/app/innovations/ai-powered-assessment/page.tsx"
    
    fix_ai_assessment_page(file_path)
