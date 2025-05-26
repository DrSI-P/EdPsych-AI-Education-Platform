#!/usr/bin/env python3
"""
Batch fix script for assessment question types TypeScript errors
This script fixes common TypeScript syntax errors in the assessment question type components.
"""

import re
import sys
import os
import glob

def fix_assessment_question_types(directory_path):
    # Find all assessment question type files
    question_type_files = glob.glob(os.path.join(directory_path, "src/components/assessment/question-types/*.tsx"))
    
    fixed_files = 0
    
    for file_path in question_type_files:
        try:
            with open(file_path, 'r') as file:
                content = file.read()
            
            # Store the original content for comparison
            original_content = content
            
            # Fix invalid array declarations
            content = re.sub(r'(\w+)\[\]', r'\1: any[]', content)
            
            # Fix double colon syntax errors
            content = re.sub(r'(\w+): (\w+): any\[\]', r'\1: \2[]', content)
            
            # Fix trailing commas in interface properties
            content = re.sub(r'(\w+): (\w+);,', r'\1: \2;', content)
            
            # Fix trailing semicolons in object literals
            content = re.sub(r'};', r'}', content)
            
            # Fix JSX syntax with double > characters
            content = re.sub(r'<(div|span|p|h[1-6])>>(.*?)</\1>', r'<\1>\2</\1>', content)
            
            # Fix useState with extra angle brackets
            content = re.sub(r'useState<(\w+)>>', r'useState<\1>', content)
            
            # Fix incorrect equality operators
            content = re.sub(r'(\w+) = ==', r'\1 ===', content)
            
            # Only write if changes were made
            if content != original_content:
                with open(file_path, 'w') as file:
                    file.write(content)
                print(f"Fixed TypeScript syntax in {file_path}")
                fixed_files += 1
            else:
                print(f"No changes needed for {file_path}")
        except Exception as e:
            print(f"Error processing {file_path}: {str(e)}")
    
    return fixed_files

if __name__ == "__main__":
    if len(sys.argv) > 1:
        directory_path = sys.argv[1]
    else:
        directory_path = "/home/ubuntu/edpsych-repo"
    
    fixed_count = fix_assessment_question_types(directory_path)
    print(f"Fixed {fixed_count} assessment question type files")
