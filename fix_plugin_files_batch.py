#!/usr/bin/env python3
"""
Batch fix script for plugins/registry.ts and assessmentToolPlugin.ts TypeScript errors
This script fixes the specific syntax errors in these plugin-related files
"""

import re
import sys
import os

def fix_plugin_files(repo_dir):
    # List of plugin-related files with array syntax errors
    plugin_files = [
        os.path.join(repo_dir, "src/lib/plugins/registry.ts"),
        os.path.join(repo_dir, "src/lib/plugins/templates/assessmentToolPlugin.ts")
    ]
    
    for file_path in plugin_files:
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            continue
            
        with open(file_path, 'r') as file:
            content = file.read()
        
        # Store the original content for comparison
        original_content = content
        
        # Fix invalid array declarations in assessmentToolPlugin.ts
        content = re.sub(
            r'convertToQuestionResponses\(responses\[\]\)',
            r'convertToQuestionResponses(responses: any[])',
            content
        )
        
        # Fix invalid type casting with double colons in registry.ts
        content = re.sub(
            r'as string: any\[\]',
            r'as string[]',
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
    fix_plugin_files(repo_dir)
