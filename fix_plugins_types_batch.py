#!/usr/bin/env python3
"""
Batch fix script for plugins/types.ts TypeScript errors
This script fixes the specific syntax errors in plugins/types.ts file
"""

import re
import sys
import os

def fix_plugins_types(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Store the original content for comparison
    original_content = content
    
    # Fix invalid return type declarations with double colons
    # Error: listPlugins: (status?: PluginStatus) => PluginInstance: any[] -> listPlugins: (status?: PluginStatus) => PluginInstance[]
    content = re.sub(
        r'PluginInstance: any\[\]',
        r'PluginInstance[]',
        content
    )
    
    # Fix other invalid array declarations
    content = re.sub(
        r'responses\[\]',
        r'responses: any[]',
        content
    )
    
    # Fix other similar double colon patterns
    content = re.sub(
        r'(\w+): any\[\]',
        r'\1[]',
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
        file_path = "/home/ubuntu/edpsych-repo/src/lib/plugins/types.ts"
    
    fix_plugins_types(file_path)
