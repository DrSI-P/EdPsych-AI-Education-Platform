#!/usr/bin/env python3
"""
Manual fix script for ai-powered-assessment/page.tsx TypeScript errors
This script fixes the specific syntax errors in the assessment page file by directly targeting
the known error patterns in the file.
"""

import re
import sys
import os

def fix_assessment_page_manual(file_path):
    try:
        with open(file_path, 'r') as file:
            content = file.read()
        
        # Store the original content for comparison
        original_content = content
        
        # Fix trailing commas in interface properties
        content = re.sub(r'(\w+): (\w+);,', r'\1: \2;', content)
        
        # Fix double colon syntax errors
        content = re.sub(r'correctAnswer\?: string \| string: any;', r'correctAnswer?: string | string[];', content)
        
        # Fix trailing semicolons in interface blocks
        content = re.sub(r'levels: \{;', r'levels: {', content)
        
        # Fix conceptsAssessed array declaration
        content = re.sub(r'conceptsAssessed: \{;', r'conceptsAssessed: {', content)
        
        # Fix incorrect equality operators
        content = re.sub(r'currentQuestion\.type = ==', r'currentQuestion.type ===', content)
        
        # Fix array declarations
        content = re.sub(r'const \[results, setResults\] = useState<AssessmentResult>\(\[\]\);', 
                         r'const [results, setResults] = useState<AssessmentResult[]>([]);', content)
        
        content = re.sub(r'const \[conceptMastery, setConceptMastery\] = useState<ConceptMastery>\(\[', 
                         r'const [conceptMastery, setConceptMastery] = useState<ConceptMastery[]>([', content)
        
        content = re.sub(r'const \[questions, setQuestions\] = useState<AssessmentQuestion>\(\[', 
                         r'const [questions, setQuestions] = useState<AssessmentQuestion[]>([', content)
        
        # Fix trailing semicolons in object literals
        content = re.sub(r'    \};', r'    }', content)
        
        # Fix incorrect arrow function syntax
        content = re.sub(r'setConceptMastery\(prev = > ', r'setConceptMastery(prev => ', content)
        
        # Fix incorrect ternary operator syntax
        content = re.sub(r"trend: newMastery > concept\.mastery \? 'improving' : ,\s+newMastery < concept\.mastery \? 'declining' : 'stable'", 
                         r"trend: newMastery > concept.mastery ? 'improving' : (newMastery < concept.mastery ? 'declining' : 'stable')", content)
        
        # Fix incorrect array access in text answer evaluation
        content = re.sub(r'const possibleAnswers = currentQuestion\.correctAnswer as string: any;,', 
                         r'const possibleAnswers = currentQuestion.correctAnswer as string[];', content)
        
        content = re.sub(r'textAnswer\.toLowerCase\(\)\.includes\(answer\.toLowerCase\(\)\);', 
                         r'textAnswer.toLowerCase().includes(answer.toLowerCase())', content)
        
        # Fix incorrect logical AND operator
        content = re.sub(r'const keywordScore = textAnswer\.toLowerCase\(\)\.includes\(\'substitution\'\) && ;', 
                         r'const keywordScore = textAnswer.toLowerCase().includes(\'substitution\') && ', content)
        
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
        file_path = "/home/ubuntu/edpsych-repo/src/app/innovations/ai-powered-assessment/page.tsx"
    
    fix_assessment_page_manual(file_path)
