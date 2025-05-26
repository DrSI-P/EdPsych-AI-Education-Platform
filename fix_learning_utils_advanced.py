#!/usr/bin/env python3
"""
Advanced manual fix script for learning-utils.tsx TypeScript errors
This script uses a more targeted approach to fix the specific syntax errors in the learning utils file
by addressing the complex React component structure issues.
"""

import re
import sys
import os

def fix_learning_utils_advanced(file_path):
    try:
        with open(file_path, 'r') as file:
            content = file.read()
        
        # Store the original content for comparison
        original_content = content
        
        # Fix the complex function declaration issues
        # This pattern matches the problematic function declaration and fixes it
        pattern = r'export const useLearningRecommendations = \(\s*userId: string,\s*count: number = 3\s*\):\s*\{\s*recommendations: LearningRecommendation\[\];\s*loading: boolean;\s*error: string \| null;\s*refresh: \(\) => Promise<void>;\s*\} => \{'
        replacement = r'export const useLearningRecommendations = (\n  userId: string,\n  count: number = 3\n): {\n  recommendations: LearningRecommendation[];\n  loading: boolean;\n  error: string | null;\n  refresh: () => Promise<void>;\n} => {'
        content = re.sub(pattern, replacement, content)
        
        # Fix the problematic hook declaration
        pattern = r'\} = \{'
        replacement = r'} = () => {'
        content = re.sub(pattern, replacement, content)
        
        # Fix useState with extra angle brackets
        content = re.sub(
            r'useState<string>\(\'',
            r'useState<string>(\'',
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
    
    fix_learning_utils_advanced(file_path)
