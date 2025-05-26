#!/usr/bin/env python3
"""
Targeted TypeScript Error Fix Script

This script applies more conservative fixes to TypeScript errors, focusing on:
- Properly fixing array type annotations
- Correcting index signatures
- Fixing common syntax errors without introducing new ones

The script is designed to avoid the issues found in the previous advanced fix script.
"""

import os
import re
import sys
from pathlib import Path

# Files with highest error counts to prioritize
HIGH_PRIORITY_FILES = [
    "src/lib/compliance/gdprComplianceService.ts",
    "src/lib/plugins/implementations/cognifitAssessmentPlugin.ts",
    "src/lib/compliance/types.ts",
    "src/lib/compliance/safeguardingService.ts",
    "src/lib/content-creation/types.ts",
    "src/lib/analytics/types.ts",
    "src/lib/assessment/types.ts",
    "src/lib/i18n/types.ts",
    "src/lib/collaboration/types.ts",
    "src/lib/learning-utils.tsx"
]

# Patterns to fix - more conservative approach
PATTERNS = [
    # Fix index signatures without type (TS1005, TS1131) - CONSERVATIVE
    (r'(\[key: string\]);', r'\1: any;'),
    
    # Fix incomplete array declarations (TS1011) - CONSERVATIVE
    (r'(\s+)(\w+)\[\];', r'\1\2: any[];'),
    
    # Fix missing semicolons after type declarations (TS1005)
    (r'(type \w+ = [^;]+)(?=\n)', r'\1;'),
    
    # Fix missing commas in parameter lists (TS1005)
    (r'(\w+: [a-zA-Z<>\[\]]+)(\s+\w+:)', r'\1,\2'),
]

def fix_file(file_path):
    """Fix TypeScript syntax issues in a file."""
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    original_content = content
    modified = False
    
    for pattern, replacement in PATTERNS:
        new_content = re.sub(pattern, replacement, content)
        if new_content != content:
            content = new_content
            modified = True
    
    if modified:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Fixed: {file_path}")
        return True
    
    return False

def process_files(files):
    """Process a list of files and apply fixes."""
    fixed_files = []
    
    for file_path in files:
        if os.path.exists(file_path) and os.path.isfile(file_path):
            if fix_file(file_path):
                fixed_files.append(file_path)
        else:
            print(f"Warning: File not found - {file_path}")
    
    return fixed_files

def main():
    """Main function."""
    print("Starting targeted TypeScript error fix script...")
    
    # Process high priority files first
    print("\nProcessing high priority files:")
    fixed_high_priority = process_files(HIGH_PRIORITY_FILES)
    
    # Process any additional files specified as arguments
    additional_files = []
    if len(sys.argv) > 1:
        additional_files = sys.argv[1:]
        print("\nProcessing additional files:")
        fixed_additional = process_files(additional_files)
    else:
        fixed_additional = []
    
    # Summary
    total_fixed = len(fixed_high_priority) + len(fixed_additional)
    print(f"\nSummary: Fixed {total_fixed} files")
    print(f"  - High priority files: {len(fixed_high_priority)}/{len(HIGH_PRIORITY_FILES)}")
    if additional_files:
        print(f"  - Additional files: {len(fixed_additional)}/{len(additional_files)}")

if __name__ == "__main__":
    main()
