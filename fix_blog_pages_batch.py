#!/usr/bin/env python3
"""
Batch fix script for blog page TypeScript errors
This script fixes the specific syntax errors in blog-related files
"""

import re
import sys
import os

def fix_blog_pages(repo_dir):
    # List of blog-related files with array syntax errors
    blog_files = [
        os.path.join(repo_dir, "src/pages/blog/[slug].tsx"),
        os.path.join(repo_dir, "src/pages/blog/categories.tsx")
    ]
    
    for file_path in blog_files:
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            continue
            
        with open(file_path, 'r') as file:
            content = file.read()
        
        # Store the original content for comparison
        original_content = content
        
        # Fix invalid array declarations in blog files
        content = re.sub(
            r'relatedPosts\[\];',
            r'relatedPosts: any[];',
            content
        )
        
        content = re.sub(
            r'categories\[\];',
            r'categories: any[];',
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
    fix_blog_pages(repo_dir)
