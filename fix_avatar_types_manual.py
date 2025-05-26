#!/usr/bin/env python3
"""
Highly targeted manual fix script for avatar/types.ts TypeScript errors
This script carefully fixes the specific syntax errors in the avatar types file
by addressing each complex array and type declaration issue individually.
"""

import re
import sys
import os

def fix_avatar_types_manual(file_path):
    try:
        with open(file_path, 'r') as file:
            content = file.read()
        
        # Store the original content for comparison
        original_content = content
        
        # Fix targetAudience array declaration
        content = re.sub(r'targetAudience: any: any\[\];', r'targetAudience: string[];', content)
        
        # Fix curriculumLinks array declaration
        content = re.sub(r'curriculumLinks\?: string: any: any\[\];', r'curriculumLinks?: string[];', content)
        
        # Fix tags array declaration
        content = re.sub(r'tags: any: any\[\];', r'tags: string[];', content)
        
        # Fix visualCues array declaration
        content = re.sub(r'visualCues\?: VisualCue: any: any\[\];', r'visualCues?: VisualCue[];', content)
        
        # Fix emotionMarkers array declaration
        content = re.sub(r'emotionMarkers\?: EmotionMarker: any: any\[\];', r'emotionMarkers?: EmotionMarker[];', content)
        
        # Fix pauseMarkers array declaration
        content = re.sub(r'pauseMarkers\?: PauseMarker: any: any\[\];', r'pauseMarkers?: PauseMarker[];', content)
        
        # Fix emphasisMarkers array declaration
        content = re.sub(r'emphasisMarkers\?: EmphasisMarker: any: any\[\];', r'emphasisMarkers?: EmphasisMarker[];', content)
        
        # Fix supportedEmotions array declaration
        content = re.sub(r'supportedEmotions: any: any\[\];', r'supportedEmotions: AvatarEmotion[];', content)
        
        # Fix supportedSpeakingStyles array declaration
        content = re.sub(r'supportedSpeakingStyles: any: any\[\];', r'supportedSpeakingStyles: AvatarSpeakingStyle[];', content)
        
        # Fix supportedBackgrounds array declaration
        content = re.sub(r'supportedBackgrounds: any: any\[\];', r'supportedBackgrounds: AvatarBackgroundType[];', content)
        
        # Fix supportedLanguages array declaration
        content = re.sub(r'supportedLanguages: any: any\[\];', r'supportedLanguages: string[];', content)
        
        # Fix tags array declaration in AvatarModel
        content = re.sub(r'tags: any: any\[\];', r'tags: string[];', content)
        
        # Fix userRole array declaration
        content = re.sub(r'userRole\?: string: any: any\[\];', r'userRole?: string[];', content)
        
        # Fix deviceType array declaration
        content = re.sub(r'deviceType\?: string: any: any\[\];', r'deviceType?: string[];', content)
        
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
        file_path = "/home/ubuntu/edpsych-repo/src/lib/avatar/types.ts"
    
    fix_avatar_types_manual(file_path)
