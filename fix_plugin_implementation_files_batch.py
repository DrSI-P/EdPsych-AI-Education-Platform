#!/usr/bin/env python3
"""
Batch fix script for googleDrive.ts and cognifitAssessmentPlugin.ts TypeScript errors
This script fixes the specific syntax errors in these plugin implementation files
"""

import re
import sys
import os

def fix_plugin_implementation_files(repo_dir):
    # List of plugin implementation files with array syntax errors
    plugin_files = [
        os.path.join(repo_dir, "src/lib/plugins/googleDrive.ts"),
        os.path.join(repo_dir, "src/lib/plugins/implementations/cognifitAssessmentPlugin.ts")
    ]
    
    for file_path in plugin_files:
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            continue
            
        with open(file_path, 'r') as file:
            content = file.read()
        
        # Store the original content for comparison
        original_content = content
        
        # Fix invalid array declarations in googleDrive.ts
        content = re.sub(
            r'parents\[\];',
            r'parents: string[];',
            content
        )
        
        # Fix invalid array declarations in cognifitAssessmentPlugin.ts
        content = re.sub(
            r'const items\[\]',
            r'const items: any[]',
            content
        )
        
        content = re.sub(
            r'const itemResults\[\]',
            r'const itemResults: any[]',
            content
        )
        
        content = re.sub(
            r'let subdomains\[\]',
            r'let subdomains: string[]',
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
    repo_dir = "/home/ubuntu/edpsych-repo"
    fix_plugin_implementation_files(repo_dir)
