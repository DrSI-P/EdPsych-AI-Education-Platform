#!/usr/bin/env python3
"""
Line-by-line manual fix script for ai-avatar/types.ts TypeScript errors
This script carefully fixes the specific syntax errors in the ai-avatar types file
by addressing each issue individually without introducing new problems.
"""

import re
import sys
import os

def fix_ai_avatar_types_line_by_line(file_path):
    try:
        with open(file_path, 'r') as file:
            content = file.read()
        
        # Store the original content for comparison
        original_content = content
        
        # Fix escaped single quotes in enums
        content = re.sub(r"= \\'([A-Z_]+)\\'", r"= '\1'", content)
        
        # Fix inconsistent enum value format (lowercase with semicolon)
        content = re.sub(r"= 'inspirational';", r"= 'INSPIRATIONAL'", content)
        content = re.sub(r"= 'administrators';", r"= 'ADMINISTRATORS'", content)
        
        # Fix getVideo return type (should be singular, not array)
        content = re.sub(r"getVideo: \(id: string\) => Promise<AIAvatarVideo\[\]>;", 
                         r"getVideo: (id: string) => Promise<AIAvatarVideo>;", content)
        
        # Only write if changes were made
        if content != original_content:
            with open(file_path, 'w') as file:
                file.write(content)
            print(f"Fixed TypeScript syntax in {file_path}")
            return True
        else:
            print(f"No changes needed for {file_path}")
            return False
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/components/ai-avatar/types.ts"
    
    fix_ai_avatar_types_line_by_line(file_path)
