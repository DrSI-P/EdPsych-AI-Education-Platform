#!/usr/bin/env python3

import os
import re
import sys
from pathlib import Path

def fix_all_type_annotations(content, file_path):
    """
    Apply all type annotation fixes in a single comprehensive function.
    Only for project source files, not node_modules.
    """
    # Direct replacements for known problematic patterns in specific files
    if "ChatInterface.tsx" in file_path:
        content = content.replace("initialMessages?: Message: any[]", "initialMessages?: Message[]")
        content = content.replace("const [messages, setMessages] = useState<Message: any[]>", "const [messages, setMessages] = useState<Message[]>")
    
    if "FAQBrowser.tsx" in file_path:
        content = content.replace("initialCategories?: FAQCategory: any[]", "initialCategories?: FAQCategory[]")
        content = content.replace("initialQuestions?: FAQQuestion: any[]", "initialQuestions?: FAQQuestion[]")
        content = content.replace("const [categories, setCategories] = useState<FAQCategory: any[]>", "const [categories, setCategories] = useState<FAQCategory[]>")
        content = content.replace("const [questions, setQuestions] = useState<FAQQuestion: any[]>", "const [questions, setQuestions] = useState<FAQQuestion[]>")
    
    if "FAQDetail.tsx" in file_path:
        content = content.replace("const [relatedQuestions, setRelatedQuestions] = useState<any: any[]>", "const [relatedQuestions, setRelatedQuestions] = useState<any[]>")
    
    if "utils.ts" in file_path:
        content = content.replace("export function cn(...inputs: ClassValue: any[])", "export function cn(...inputs: ClassValue[])")
        content = content.replace("export function debounce<T extends (...args: any: any[]) => any>", "export function debounce<T extends (...args: any[]) => any>")
    
    if "[slug].tsx" in file_path and "/blog/" in file_path:
        content = content.replace("relatedPosts: any: any[]", "relatedPosts: any[]")
    
    if "categories.tsx" in file_path and "/blog/" in file_path:
        content = content.replace("categories: Category: any[]", "categories: Category[]")
    
    if "new.tsx" in file_path and "/blog/" in file_path:
        content = content.replace("categories: Category: any[]", "categories: Category[]")
    
    if "text-to-speech-engine.tsx" in file_path:
        content = content.replace("useState<SpeechSynthesisVoiceType: any[]>", "useState<SpeechSynthesisVoiceType[]>")
    
    if "curriculum-differentiation-engine.tsx" in file_path:
        content = content.replace("objectives?: string: any[]", "objectives?: string[]")
    
    if "emotional-checkin.tsx" in file_path:
        content = content.replace("triggers: string: any[]", "triggers: string[]")
        content = content.replace("strategies: string: any[]", "strategies: string[]")
    
    # Generic patterns to catch all similar issues across the codebase
    
    # Fix double colon patterns with any: any[]
    pattern = r': any: any\[\]'
    replacement = r': any[]'
    content = re.sub(pattern, replacement, content)
    
    # Fix corrupted type annotations with colon-any patterns in interface properties
    pattern = r'(\w+)(\??): (\w+): any\[\]'
    replacement = r'\1\2: \3[]'
    content = re.sub(pattern, replacement, content)
    
    # Fix corrupted type annotations in function parameters
    pattern = r'(\w+)\(([^)]*\.\.\.)(\w+): (\w+): any\[\]([^)]*)\)'
    replacement = r'\1(\2\3: \4[]\5)'
    content = re.sub(pattern, replacement, content)
    
    # Fix corrupted type annotations in useState hooks
    pattern = r'useState<(\w+): any\[\]>'
    replacement = r'useState<\1[]>'
    content = re.sub(pattern, replacement, content)
    
    # Fix corrupted type annotations in other generic types
    pattern = r'<(\w+): any\[\]>'
    replacement = r'<\1[]>'
    content = re.sub(pattern, replacement, content)
    
    # Fix missing type annotations before array brackets in property definitions
    pattern = r'(\w+)(\??)\[\](?!\s*:)'
    replacement = r'\1\2: any[]'
    content = re.sub(pattern, replacement, content)
    
    # Fix missing type annotations in function parameters with array brackets
    pattern = r'(\w+): \((\w+)\[\]\)'
    replacement = r'\1: (\2: any[])'
    content = re.sub(pattern, replacement, content)
    
    # Fix function generic syntax errors
    pattern = r'(\w+)<T extends \(\.\.\.(args)\[\]\) => any>'
    replacement = r'\1<T extends (...\2: any[]) => any>'
    content = re.sub(pattern, replacement, content)
    
    # Fix corrupted type annotations in function generic parameters
    pattern = r'(\w+)<T extends \(\.\.\.(args): any\[\]\) => any>'
    replacement = r'\1<T extends (...\2: any[]) => any>'
    content = re.sub(pattern, replacement, content)
    
    # Fix array casting with corrupted type annotations
    pattern = r'(\w+): \[\] as (\w+): any\[\]'
    replacement = r'\1: [] as \2[]'
    content = re.sub(pattern, replacement, content)
    
    # Fix corrupted type annotations in union types
    pattern = r'(\w+): ([^|]+) \| ([^:]+): any\[\]'
    replacement = r'\1: \2 | \3[]'
    content = re.sub(pattern, replacement, content)
    
    return content

def is_project_source_file(file_path):
    """
    Check if the file is a project source file and not in node_modules or other excluded directories.
    """
    excluded_dirs = ['node_modules', '.git', '.next', 'dist', 'build']
    for excluded_dir in excluded_dirs:
        if f'/{excluded_dir}/' in file_path or file_path.endswith(f'/{excluded_dir}'):
            return False
    return True

def process_file(file_path, max_passes=5):
    """Process a single file to fix all identified syntax errors."""
    try:
        # Skip if not a project source file
        if not is_project_source_file(file_path):
            return False
            
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        original_content = content
        
        # Apply all fixes
        content = fix_all_type_annotations(content, file_path)
        
        # Only write back if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Fixed: {file_path}")
            return True
        else:
            print(f"No changes needed: {file_path}")
            return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def process_directory(directory, extensions=None):
    """
    Process all files in a directory recursively.
    
    Args:
        directory: The directory to process
        extensions: List of file extensions to process (default: ['.ts', '.tsx'])
    """
    if extensions is None:
        extensions = ['.ts', '.tsx']
    
    fixed_files = []
    
    for root, _, files in os.walk(directory):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                file_path = os.path.join(root, file)
                if process_file(file_path):
                    fixed_files.append(file_path)
    
    return fixed_files

def main():
    """Main function to process the repository."""
    repo_dir = "/home/ubuntu/edpsych-repo/src"
    
    # Process specific files with known issues
    specific_files = [
        "/home/ubuntu/edpsych-repo/src/components/faq/ChatInterface.tsx",
        "/home/ubuntu/edpsych-repo/src/components/faq/FAQBrowser.tsx",
        "/home/ubuntu/edpsych-repo/src/components/faq/FAQDetail.tsx",
        "/home/ubuntu/edpsych-repo/src/lib/utils.ts",
        "/home/ubuntu/edpsych-repo/src/pages/blog/[slug].tsx",
        "/home/ubuntu/edpsych-repo/src/pages/blog/categories.tsx",
        "/home/ubuntu/edpsych-repo/src/pages/blog/new.tsx",
        "/home/ubuntu/edpsych-repo/src/components/ai/accessibility/text-to-speech-engine.tsx",
        "/home/ubuntu/edpsych-repo/src/components/ai/curriculum-differentiation/curriculum-differentiation-engine.tsx",
        "/home/ubuntu/edpsych-repo/src/components/ai/emotional-wellbeing/emotional-checkin.tsx"
    ]
    
    fixed_files = []
    
    # Process specific files first
    for file_path in specific_files:
        if os.path.exists(file_path):
            if process_file(file_path):
                fixed_files.append(file_path)
    
    # Then process the entire src directory to catch any other instances
    fixed_files.extend(process_directory(repo_dir))
    
    print(f"\nTotal files fixed: {len(fixed_files)}")
    for file in fixed_files:
        print(f"  - {file}")
    
    # Validate critical files
    print("\nValidating critical files...")
    for file_path in specific_files:
        if os.path.exists(file_path):
            print(f"Checking {file_path}...")
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
                
            # Check for any remaining problematic patterns
            if ": any: any[]" in content:
                print(f"WARNING: File {file_path} still contains ': any: any[]' pattern!")
            elif ": any[]" in content and not "useState<any[]>" in content and not ": readonly any[]" in content:
                print(f"INFO: File {file_path} contains ': any[]' pattern (may be valid).")

if __name__ == "__main__":
    main()
