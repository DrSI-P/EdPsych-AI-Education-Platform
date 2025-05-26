#!/usr/bin/env python3
"""
Advanced manual fix script for contextual-resource-recommendation.tsx TypeScript errors
This script performs a more sophisticated line-by-line fix for the complex issues
in the contextual resource recommendation component.
"""

import re
import sys
import os

def fix_contextual_resource_recommendation_advanced(file_path):
    try:
        with open(file_path, 'r') as file:
            content = file.read()
        
        # Store the original content for comparison
        original_content = content
        
        # Fix specific array declarations with proper typing
        content = re.sub(r'resources\[\]', r'resources: Resource[]', content)
        content = re.sub(r'recommendations\[\]', r'recommendations: Recommendation[]', content)
        content = re.sub(r'categories\[\]', r'categories: string[]', content)
        content = re.sub(r'tags\[\]', r'tags: string[]', content)
        content = re.sub(r'filters\[\]', r'filters: Filter[]', content)
        
        # Fix double colon syntax errors with proper typing
        content = re.sub(r'(\w+): (\w+): any\[\]', r'\1: \2[]', content)
        
        # Fix interface property declarations
        content = re.sub(r'interface (\w+) \{([^}]*)\}', lambda m: 
                         f'interface {m.group(1)} {{\n' + 
                         re.sub(r'(\w+)(?!\s*:)', r'\1: any', m.group(2)) + 
                         '\n}', content)
        
        # Fix missing semicolons in interface properties
        content = re.sub(r'(\w+): (\w+)\n', r'\1: \2;\n', content)
        
        # Fix JSX syntax with double > characters
        content = re.sub(r'<(div|span|p|h[1-6]|button)>>(.*?)</\1>', r'<\1>\2</\1>', content)
        
        # Fix useState with extra angle brackets
        content = re.sub(r'useState<(\w+)>>', r'useState<\1>', content)
        
        # Fix useEffect with missing dependency array
        content = re.sub(r'useEffect\(\(\) => \{([^}]*)\}\)', r'useEffect(() => {\1}, [])', content)
        
        # Fix incorrect function return types
        content = re.sub(r'function (\w+)\(\): void: (\w+)', r'function \1(): \2', content)
        
        # Fix incorrect arrow function syntax
        content = re.sub(r'const (\w+) = \(\): void: (\w+) => {', r'const \1 = (): \2 => {', content)
        
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
        file_path = "/home/ubuntu/edpsych-repo/src/components/resource/contextual-resource-recommendation.tsx"
    
    fix_contextual_resource_recommendation_advanced(file_path)
