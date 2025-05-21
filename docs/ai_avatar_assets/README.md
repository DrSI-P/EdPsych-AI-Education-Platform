# AI Avatar Assets for EdPsych-AI-Education-Platform

This directory contains all the necessary assets and documentation for implementing AI video avatars for the EdPsych-AI-Education-Platform, with a focus on using Dr. Scott Ighavongbe-Patrick's likeness and voice for the teacher avatar.

## Directory Contents

- **`teacher_avatar_clips.md`**: Scripts for Dr. Scott's teacher avatar videos
- **`student_peer_avatar_clips.md`**: Scripts for student peer avatar videos
- **`special_needs_support_avatar_clips.md`**: Scripts for special needs support avatar videos
- **`subject_specialist_avatar_clips.md`**: Scripts for subject specialist avatar videos
- **`avatar_metadata.json`**: Metadata for all avatars, including configuration for Dr. Scott's image and voice
- **`implementation_guide.md`**: Detailed guide for implementing the avatars using HeyGen
- **`README.md`**: This file

## Overview

The AI avatar assets have been designed to provide a comprehensive set of educational videos for the platform, featuring:

1. **Teacher Avatar (Dr. Scott Ighavongbe-Patrick)**
   - Professional educational psychologist
   - Uses Dr. Scott's actual image and voice
   - Provides authoritative educational content

2. **Student Peer Avatars**
   - Relatable to the target student audience
   - Age-appropriate for different educational levels
   - Provides peer-to-peer learning support

3. **Special Needs Support Avatars**
   - Focused on emotional regulation and support
   - Designed for students with special educational needs
   - Provides specialized guidance and reassurance

4. **Subject Specialist Avatars**
   - Expertise in specific academic subjects
   - Provides in-depth subject knowledge
   - Connects content to UK curriculum standards

## Using These Assets

### For Content Creators

1. Review the script files to understand the content and tone for each avatar type
2. Follow the implementation guide to generate videos using HeyGen
3. Use the metadata file to organize and track the generated videos
4. Use the commit script to regularly push changes to GitHub

### For Developers

1. The metadata file (`avatar_metadata.json`) contains all the information needed to integrate the videos into the platform
2. The HeyGen service is already integrated in the platform code at `/src/lib/heygen/heygen-service.ts`
3. The video viewer component is implemented at `/src/app/ai-avatar-videos/view/[id]/page.tsx`

## Implementation Process

1. **Script Creation**: ✅ Complete
   - All scripts have been created for the four avatar types
   - Scripts follow educational best practices and are aligned with UK curriculum standards

2. **Metadata Configuration**: ✅ Complete
   - Metadata file includes all necessary information for video generation
   - Special configuration for Dr. Scott's avatar using his image and voice

3. **Implementation Guide**: ✅ Complete
   - Detailed instructions for generating videos using HeyGen
   - Step-by-step process for avatar creation, video generation, and platform integration

4. **Video Generation**: 🔄 In Progress
   - Follow the implementation guide to generate videos using HeyGen
   - Use Dr. Scott's provided images and voice samples for the teacher avatar

5. **Platform Integration**: 🔄 In Progress
   - Once videos are generated, update the metadata file with video URLs
   - Test the integration using the existing video viewer component

## Using Dr. Scott's Image and Voice

Dr. Scott Ighavongbe-Patrick's image and voice samples have been provided for creating the teacher avatar. When implementing:

1. Use the provided high-quality images for avatar creation in HeyGen
2. Use the provided voice samples for voice cloning in HeyGen
3. Ensure the avatar maintains Dr. Scott's professional appearance and speaking style
4. Test the generated avatar thoroughly to ensure authentic representation

## GitHub Workflow

Scripts have been provided to help with regular commits and pushes to GitHub. Since you're on Windows, you can use the batch files:

```cmd
# Run the initial commit script from the repository root
scripts\initial-avatar-commit.bat

# For future commits, use the commit script
scripts\commit-avatar-assets.bat
```

Follow the prompts to commit and push changes as you progress through the implementation.

If you're using Git Bash or WSL on Windows, you can also use the bash scripts:

```bash
# Make the scripts executable
chmod +x scripts/commit-avatar-assets.sh
chmod +x scripts/initial-avatar-commit.sh

# Run the scripts from the repository root
./scripts/initial-avatar-commit.sh
./scripts/commit-avatar-assets.sh
```

## Technical Specifications

All videos should follow these specifications:

- **Format**: MP4
- **Resolution**: 1080p (1920x1080)
- **Aspect Ratio**: 16:9
- **Frame Rate**: 30fps
- **Audio**: Clear stereo audio, 44.1kHz
- **Duration**: As specified in the script files (typically 30-60 seconds per clip)
- **Background**: As specified in the script files (typically neutral, office, or classroom settings)

## Contact

If you have any questions or need assistance with the implementation, please contact the project lead.