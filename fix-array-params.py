#!/usr/bin/env python3

import os
import re
import glob

# Find all TypeScript files in the src directory
ts_files = glob.glob('src/**/*.ts', recursive=True)
tsx_files = glob.glob('src/**/*.tsx', recursive=True)
all_files = ts_files + tsx_files

# Pattern to fix invalid array parameter typings
def fix_array_params(content):
    # Find function parameter lists
    function_pattern = r'function\s+\w+\s*\([^)]*\)'
    function_matches = re.finditer(function_pattern, content)
    
    for match in function_matches:
        param_list = match.group(0)
        # Check for invalid array parameter syntax
        if re.search(r'\w+\[\s*\](?:,|\s*\))', param_list):
            # Extract parameter list
            params_start = param_list.find('(')
            params_end = param_list.find(')')
            params = param_list[params_start+1:params_end]
            
            # Fix each parameter
            fixed_params = []
            for param in params.split(','):
                param = param.strip()
                if re.search(r'^\w+\[\s*\]$', param):
                    # Convert 'items[]' to 'items: any[]'
                    param_name = param.split('[')[0]
                    fixed_param = f"{param_name}: any[]"
                    fixed_params.append(fixed_param)
                else:
                    fixed_params.append(param)
            
            # Reconstruct the parameter list
            fixed_param_list = f"{param_list[:params_start+1]}{', '.join(fixed_params)}{param_list[params_end:]}"
            content = content.replace(param_list, fixed_param_list)
    
    return content

# Process each file
for file_path in all_files:
    try:
        with open(file_path, 'r') as file:
            content = file.read()
        
        # Check if file contains invalid array parameter syntax
        if re.search(r'\w+\[\s*\](?:,|\s*\))', content):
            print(f"Processing {file_path}")
            modified_content = fix_array_params(content)
            
            # Write back if modified
            if modified_content != content:
                with open(file_path, 'w') as file:
                    file.write(modified_content)
                print(f"Fixed array parameters in {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

print("Fixed invalid array parameter typings in .ts and .tsx files")
