#!/usr/bin/env python3
"""
Manual fix script for learning-utils.tsx TypeScript errors
This script fixes the specific syntax errors in the learning utils file by directly targeting
the known error patterns in the file.
"""

import re
import sys
import os

def fix_learning_utils_manual(file_path):
    try:
        with open(file_path, 'r') as file:
            content = file.read()
        
        # Store the original content for comparison
        original_content = content
        
        # Fix arrow function syntax errors
        content = re.sub(
            r'\} => \{',
            r'}) => {',
            content
        )
        
        # Fix useState with extra angle brackets
        content = re.sub(
            r'useState<string>>',
            r'useState<string>',
            content
        )
        
        # Fix trailing semicolons in object literals
        content = re.sub(
            r'};',
            r'}',
            content
        )
        
        # Fix achievements array declaration
        content = re.sub(
            r'achievements: any\[\];',
            r'achievements: any[];',
            content
        )
        
        # Fix JSX syntax with double > characters
        content = re.sub(
            r'<(h[1-6])>>(.*?)</\1>',
            r'<\1>\2</\1>',
            content
        )
        
        # Fix JSX syntax with double > characters in paragraphs
        content = re.sub(
            r'<(p)>>(.*?)</\1>',
            r'<\1>\2</\1>',
            content
        )
        
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
        file_path = "/home/ubuntu/edpsych-repo/src/lib/learning-utils.tsx"
    
    fix_learning_utils_manual(file_path)
