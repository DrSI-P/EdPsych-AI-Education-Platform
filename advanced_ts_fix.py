#!/usr/bin/env python3
"""
Advanced TypeScript Error Fix Script

This script targets the most common TypeScript error patterns found in the EdPsych Connect platform:
- TS1005: Missing punctuation (commas, semicolons, colons)
- TS1011: Incomplete array access expressions
- TS1109: Missing expressions
- TS1128: Incomplete declarations or statements
- TS1131: Malformed property or signature definitions

The script focuses on the highest-error files identified in the error analysis.
"""

import os
import re
import sys
from pathlib import Path

# Files with highest error counts to prioritize
HIGH_PRIORITY_FILES = [
    "src/lib/content-creation/types.ts",
    "src/lib/compliance/types.ts",
    "src/lib/compliance/safeguardingService.ts",
    "src/lib/communication/types.ts",
    "src/lib/learning-utils.tsx",
    "src/lib/analytics/types.ts",
    "src/lib/assessment/feedbackGeneratorService.ts",
    "src/lib/i18n/types.ts",
    "src/lib/compliance/gdprComplianceService.ts",
    "src/lib/plugins/implementations/cognifitAssessmentPlugin.ts",
    "src/lib/collaboration/types.ts",
    "src/lib/assessment/types.ts"
]

# Patterns to fix
PATTERNS = [
    # Fix index signatures without type (TS1005, TS1131)
    (r'(\[key: string\]);', r'\1: any;'),
    (r'(\[key: string\]) *{', r'\1: any {'),
    (r'(\[key: [a-zA-Z]+\]);', r'\1: any;'),
    
    # Fix incomplete array access expressions (TS1011)
    (r'(\w+)\[\];', r'\1: any[];'),
    
    # Fix missing expressions in function parameters (TS1109)
    (r'(\w+): \(([^)]*)\) *=>', r'\1: (\2) =>'),
    
    # Fix missing semicolons after type declarations (TS1005)
    (r'(type \w+ = [^;]+)(?=\n)', r'\1;'),
    
    # Fix malformed property signatures in interfaces (TS1131)
    (r'(\s+)(\w+)(?=\s*:)', r'\1\2'),
    
    # Fix missing commas in parameter lists (TS1005)
    (r'(\w+: [a-zA-Z<>\[\]]+)(\s+\w+:)', r'\1,\2'),
    
    # Fix missing type annotations in function returns (TS1005)
    (r'(\): )(?=\{)', r'\1void '),
    
    # Fix malformed generic type parameters (TS1005)
    (r'<(\w+)(?=\s*>)', r'<\1>'),
    
    # Fix missing colons in property declarations (TS1005)
    (r'(\s+\w+)(?=\s+\w+\[\];)', r'\1:'),
    
    # Fix incomplete object type literals (TS1128)
    (r'(\w+): {([^}]*)}(?!\s*[,;])', r'\1: {\2};'),
    
    # Fix missing parentheses in function types (TS1005)
    (r'=> ([a-zA-Z<>\[\]]+)(?!\s*[,;)])', r'=> (\1)'),
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
    
    # Special case for fixing index signatures in complex objects
    index_sig_pattern = r'(\s+)(\[key: string\])'
    while re.search(index_sig_pattern + r'(?!:)', content):
        new_content = re.sub(index_sig_pattern + r'(?!:)', r'\1\2: any', content)
        if new_content != content:
            content = new_content
            modified = True
        else:
            break
    
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
    print("Starting advanced TypeScript error fix script...")
    
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
