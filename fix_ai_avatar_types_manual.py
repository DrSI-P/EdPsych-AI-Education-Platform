#!/usr/bin/env python3
"""
Manual fix script for ai-avatar/types.ts TypeScript errors
This script fixes the specific syntax errors in the AI avatar types file
"""

import re
import sys
import os

def fix_ai_avatar_types_manual(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Store the original content for comparison
    original_content = content
    
    # Fix enum syntax errors (extra commas and semicolons)
    content = re.sub(
        r'([\w_]+) = \'[\w_]+\',;',
        r'\1 = \'\1\',',
        content
    )
    
    # Fix array types
    content = re.sub(
        r'tags: any;',
        r'tags: string[];',
        content
    )
    
    content = re.sub(
        r'videos: any;',
        r'videos: AIAvatarVideo[];',
        content
    )
    
    content = re.sub(
        r'categories: any;',
        r'categories: AIAvatarVideoCategory[];',
        content
    )
    
    content = re.sub(
        r'audiences: any;',
        r'audiences: AIAvatarVideoAudience[];',
        content
    )
    
    content = re.sub(
        r'featuredVideos: any;',
        r'featuredVideos: AIAvatarVideo[];',
        content
    )
    
    # Fix return types for Promise arrays
    content = re.sub(
        r'Promise<AIAvatarVideo>;',
        r'Promise<AIAvatarVideo[]>;',
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
        file_path = "/home/ubuntu/edpsych-repo/src/components/ai-avatar/types.ts"
    
    fix_ai_avatar_types_manual(file_path)
