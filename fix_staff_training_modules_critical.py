#!/usr/bin/env python3
"""
Critical fix script for staff-training-modules.tsx
This script fixes the specific syntax errors identified in the Vercel build log
"""

import re
import sys

def fix_staff_training_modules(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Store the original content for comparison
    original_content = content
    
    # Fix the specific errors identified in the build log
    # Error: sections[] -> sections: any[]
    content = re.sub(
        r'sections\[\];',
        r'sections: any[];',
        content
    )
    
    # Error: resources[] -> resources: any[]
    content = re.sub(
        r'resources\[\];',
        r'resources: any[];',
        content
    )
    
    # Fix other similar array declarations
    content = re.sub(
        r'questions\[\];',
        r'questions: any[];',
        content
    )
    
    content = re.sub(
        r'options\[\];',
        r'options: any[];',
        content
    )
    
    content = re.sub(
        r'completedSections\[\];',
        r'completedSections: string[];',
        content
    )
    
    # Only write if changes were made
    if content != original_content:
        with open(file_path, 'w') as file:
            file.write(content)
        print(f"Fixed critical TypeScript syntax in {file_path}")
    else:
        print(f"No changes needed for {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/components/restorative-justice/staff-training/staff-training-modules.tsx"
    
    fix_staff_training_modules(file_path)
