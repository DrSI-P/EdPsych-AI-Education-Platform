#!/usr/bin/env python3
"""
Highly targeted line-by-line fix script for custom-report-builder.tsx
This script makes minimal, precise changes to fix specific TypeScript errors
without disrupting the overall structure of the complex React component.
"""

import re
import sys

def fix_custom_report_builder_line_by_line(file_path):
    with open(file_path, 'r') as file:
        lines = file.readlines()
    
    # Store original lines for comparison
    original_lines = lines.copy()
    modified = False
    
    # Fix line 184: items[] parameter in ReportCanvas component
    for i, line in enumerate(lines):
        if "items[];" in line or "items[]:" in line:
            lines[i] = line.replace("items[];", "items: any[];").replace("items[]:", "items: any[];")
            modified = True
        
        # Fix setItems function parameter
        if "setItems: (items[]) =>" in line:
            lines[i] = line.replace("setItems: (items[]) =>", "setItems: (items: any[]) =>")
            modified = True
        
        # Fix other array type declarations
        if re.search(r'(\w+)\[\];', line) and not ("<" in line and ">" in line):  # Avoid JSX
            lines[i] = re.sub(r'(\w+)\[\];', r'\1: any[];', line)
            modified = True
        
        # Fix function parameter types with array syntax
        if re.search(r'(\w+): \((\w+)\[\]\)', line):
            lines[i] = re.sub(r'(\w+): \((\w+)\[\]\)', r'\1: (\2: any[])', line)
            modified = True
    
    # Only write if changes were made
    if modified:
        with open(file_path, 'w') as file:
            file.writelines(lines)
        print(f"Fixed TypeScript syntax in {file_path} with line-by-line targeted approach")
    else:
        print(f"No changes needed for {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/components/analytics/custom-report-builder.tsx"
    
    fix_custom_report_builder_line_by_line(file_path)
