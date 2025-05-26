#!/usr/bin/env python3

import re
import sys

def fix_typescript_errors(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Fix 1: Fix array type declarations in Activity interface
    content = re.sub(r'ageGroups\[\];', r'ageGroups: string[];', content)
    content = re.sub(r'materials\[\];', r'materials: string[];', content)
    content = re.sub(r'steps\[\];', r'steps: string[];', content)
    content = re.sub(r'variations\[\];', r'variations: string[];', content)
    content = re.sub(r'objectives\[\];', r'objectives: string[];', content)
    content = re.sub(r'facilitation_tips\[\];', r'facilitation_tips: string[];', content)
    
    # Fix 2: Fix array type declarations in sampleActivities
    content = re.sub(r'sampleActivities\[\]', r'sampleActivities: Activity[]', content)
    
    # Fix 3: Fix JSX truncation error
    content = re.sub(r'<di$', r'<div', content)
    
    # Write the fixed content back to the file
    with open(file_path, 'w') as file:
        file.write(content)
    
    print(f"Fixed TypeScript errors in {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/components/restorative-justice/community-building/community-building-activities.tsx"
    
    fix_typescript_errors(file_path)
