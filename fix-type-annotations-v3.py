#!/usr/bin/env python3

import os
import re
import glob

# Find all TypeScript files in the API directory
api_files = glob.glob('src/app/api/**/*.ts', recursive=True)

# Patterns to fix
patterns = [
    # Fix Zod schema min/max with ': any'
    (r'\.min\((\d+): any\)', r'.min(\1)'),
    (r'\.max\((\d+): any\)', r'.max(\1)'),
    
    # Fix Zod schema min/max with message and ': any'
    (r'\.min\((\d+): any, (\"[^\"]*\")\)', r'.min(\1, \2)'),
    (r'\.max\((\d+): any, (\"[^\"]*\")\)', r'.max(\1, \2)'),
    
    # Fix getServerSession with ': any'
    (r'getServerSession\(authOptions: any\)', r'getServerSession(authOptions)'),
    
    # Fix session checks with ': any'
    (r'!session: any', r'!session'),
    (r'!session\?\.\s*user: any', r'!session?.user'),
    (r'!session \|\| !session\.user: any', r'!session || !session.user'),
    
    # Fix URL with ': any'
    (r'request\.url: any', r'request.url'),
    (r'req\.url: any', r'req.url'),
    
    # Fix if conditions with ': any'
    (r'if \(!apiKey: any\)', r'if (!apiKey)'),
    (r'if \(id: any\)', r'if (id)'),
    
    # Fix parse with ': any'
    (r'body: any\)', r'body)'),
    (r'validatedData: any\)', r'validatedData)'),
    
    # Fix NextResponse.json with ': any'
    (r'NextResponse\.json\(result: any', r'NextResponse.json(result'),
]

# Process each file
for file_path in api_files:
    print(f"Processing {file_path}")
    
    # Read file content
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Apply all patterns
    modified = False
    for pattern, replacement in patterns:
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            modified = True
    
    # Write back if modified
    if modified:
        with open(file_path, 'w') as file:
            file.write(content)
        print(f"Fixed {file_path}")

print("Fixed invalid type annotations in API route files")
