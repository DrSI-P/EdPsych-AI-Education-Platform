#!/usr/bin/env python3
"""
Batch fix script for learning-utils.tsx TypeScript errors
This script fixes the specific syntax errors in the learning utils file
"""

import re
import sys
import os

def fix_learning_utils(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Store the original content for comparison
    original_content = content
    
    # Fix invalid JSX syntax with double > characters
    # Error: <h3>>Your Progress</h3> -> <h3>Your Progress</h3>
    content = re.sub(
        r'<(h[1-6])>>(.*?)</\1>',
        r'<\1>\2</\1>',
        content
    )
    
    # Fix invalid JSX syntax with double > characters in paragraphs
    content = re.sub(
        r'<(p)>>(.*?)</\1>',
        r'<\1>\2</\1>',
        content
    )
    
    # Fix arrow function syntax errors
    content = re.sub(
        r'\} => \{',
        r'} = {',
        content
    )
    
    # Fix function return type syntax
    content = re.sub(
        r'\): void \{',
        r') => {',
        content
    )
    
    # Fix other syntax errors
    content = re.sub(
        r'changeStyle: \(style: LearningStyle\) => void;',
        r'changeStyle: (style: LearningStyle) => void',
        content
    )
    
    # Only write if changes were made
    if content != original_content:
        with open(file_path, 'w') as file:
            file.write(content)
        print(f"Fixed TypeScript syntax in {file_path}")
    else:
        print(f"No changes needed for {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/lib/learning-utils.tsx"
    
    fix_learning_utils(file_path)
