#!/usr/bin/env python3
"""
Critical fix script for adaptive-complexity/types.ts
This script fixes the specific syntax errors identified in the Vercel build log
"""

import re
import sys

def fix_adaptive_complexity_types(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Store the original content for comparison
    original_content = content
    
    # Fix the specific errors identified in the build log
    # Error: adaptationRules?: AdaptationRule: any[] -> adaptationRules?: AdaptationRule[]
    content = re.sub(
        r'adaptationRules\?: AdaptationRule: any\[\]',
        r'adaptationRules?: AdaptationRule[]',
        content
    )
    
    # Error: recommendedNextSteps?: string: any[] -> recommendedNextSteps?: string[]
    content = re.sub(
        r'recommendedNextSteps\?: string: any\[\]',
        r'recommendedNextSteps?: string[]',
        content
    )
    
    # Fix other similar array declarations
    content = re.sub(
        r'performanceHistory: any\[\]',
        r'performanceHistory: any[]',
        content
    )
    
    content = re.sub(
        r'strengths: any\[\]',
        r'strengths: any[]',
        content
    )
    
    content = re.sub(
        r'areasForImprovement: any\[\]',
        r'areasForImprovement: any[]',
        content
    )
    
    content = re.sub(
        r'skillAreas: any\[\]',
        r'skillAreas: any[]',
        content
    )
    
    content = re.sub(
        r'prerequisites: any\[\]',
        r'prerequisites: any[]',
        content
    )
    
    content = re.sub(
        r'learningObjectives: any\[\]',
        r'learningObjectives: any[]',
        content
    )
    
    content = re.sub(
        r'adaptiveElements: any\[\]',
        r'adaptiveElements: any[]',
        content
    )
    
    # Only write if changes were made
    if content != original_content:
        with open(file_path, 'w') as file:
            file.write(content)
        print(f"Fixed critical TypeScript syntax in {file_path}")
    else:
        print(f"No changes needed for {file_path}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = "/home/ubuntu/edpsych-repo/src/lib/adaptive-complexity/types.ts"
    
    fix_adaptive_complexity_types(file_path)
