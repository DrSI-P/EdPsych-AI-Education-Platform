#!/usr/bin/env python3

import re
import sys

def fix_typescript_errors(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Fix 1: Fix array type declaration in getAvailableLanguages function
    content = re.sub(r'getAvailableLanguages = \(\): LanguageInfo: any\[\]', r'getAvailableLanguages = (): LanguageInfo[]', content)
    
    # Fix 2: Fix formatters type in TranslationOptions interface
    content = re.sub(r'formatters\?: Record<string, \(value\) => string>;', r'formatters?: Record<string, (value: any) => string>;', content)
    
    # Write the fixed content back to the file
    with open(file_path, 'w') as file:
        file.write(content)
    
    print(f"Fixed TypeScript errors in {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/lib/i18n-utils.tsx"
    
    fix_typescript_errors(file_path)
