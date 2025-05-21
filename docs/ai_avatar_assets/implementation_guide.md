# AI Avatar Implementation Guide

This guide provides detailed instructions for implementing the AI avatar videos for the EdPsych-AI-Education-Platform using HeyGen.

## Overview

The implementation process involves:
1. Setting up the HeyGen account and API access
2. Creating Dr. Scott Ighavongbe-Patrick's avatar using provided images and voice samples
3. Generating the various video clips based on the scripts
4. Post-processing and integrating the videos into the platform
5. Committing and pushing changes to GitHub

## Prerequisites

- HeyGen account with appropriate commercial licensing
- Dr. Scott Ighavongbe-Patrick's images and voice samples
- Access to the EdPsych-AI-Education-Platform GitHub repository
- Node.js and npm installed for running the platform locally

## 1. Setting Up HeyGen

### Account Setup

1. Sign in to your HeyGen account at [https://www.heygen.com/](https://www.heygen.com/)
2. Ensure you have the appropriate commercial license that allows for:
   - Custom avatar creation
   - Voice cloning
   - Commercial usage rights
   - API access

### API Configuration

1. Navigate to the API settings in your HeyGen account
2. Generate a new API key if you don't already have one
3. Add the API key to your environment variables:
   ```
   NEXT_PUBLIC_HEYGEN_API_KEY=your_api_key_here
   NEXT_PUBLIC_HEYGEN_API_URL=https://api.heygen.com
   ```
4. Update your `.env` file and any deployment environment variables

## 2. Creating Dr. Scott's Avatar

### Image Preparation

1. Collect the provided images of Dr. Scott Ighavongbe-Patrick
2. Ensure the images meet HeyGen's requirements:
   - Clear, high-resolution facial images
   - Multiple angles if possible (front, side profile)
   - Neutral expression and professional attire
   - Good lighting with minimal shadows
   - Plain background preferred

### Voice Cloning

1. Prepare the provided voice samples of Dr. Scott
2. Ensure the voice samples meet HeyGen's requirements:
   - Clear audio with minimal background noise
   - At least 2-3 minutes of continuous speech
   - Professional tone and pace
   - Variety of sentence structures and intonations
3. In HeyGen, navigate to the Voice Cloning section
4. Upload the voice samples and follow the platform's instructions
5. Test the cloned voice with a sample script to ensure quality
6. Make adjustments as needed to match Dr. Scott's natural speaking style

### Avatar Creation

1. In HeyGen, navigate to the Avatar Creation section
2. Select the option to create a custom avatar from images
3. Upload Dr. Scott's prepared images
4. Follow the platform's instructions to create the avatar
5. Associate the cloned voice with the created avatar
6. Test the avatar with a sample script to ensure quality
7. Make adjustments as needed to ensure the avatar looks professional and authentic

## 3. Generating Video Clips

### Organizing Scripts

The scripts for all avatar videos are organized in the following files:
- `/docs/ai_avatar_assets/teacher_avatar_clips.md` - For Dr. Scott's teacher avatar
- `/docs/ai_avatar_assets/student_peer_avatar_clips.md` - For student peer avatars
- `/docs/ai_avatar_assets/special_needs_support_avatar_clips.md` - For special needs support avatars
- `/docs/ai_avatar_assets/subject_specialist_avatar_clips.md` - For subject specialist avatars
- `/docs/video_scripts/executive_summary_script.md` - Full-length executive summary
- `/docs/video_scripts/platform_features_overview_script.md` - Full-length platform features overview
- `/docs/video_scripts/educational_psychology_foundations_script.md` - Full-length educational psychology foundations

### Priority Order

Generate videos in the following priority order:

1. **Teacher Avatar (Dr. Scott)**
   - Start with introduction clips
   - Then instructional clips
   - Then emotional support and transition clips
   - Finally, the full-length videos

2. **Student Peer Avatar**
   - Focus on introduction and instructional clips first

3. **Special Needs Support Avatar**
   - Focus on emotional regulation and support clips

4. **Subject Specialist Avatar**
   - Focus on introduction and subject-specific explanation clips

### Video Generation Process

For each script:

1. In HeyGen, create a new video project
2. Select Dr. Scott's avatar for teacher clips (or appropriate avatar for other types)
3. Copy the script content from the appropriate markdown file
4. Set the background according to the script specifications
5. Configure video settings:
   - Resolution: 1080p (1920x1080)
   - Aspect ratio: 16:9
   - Frame rate: 30fps
   - Audio: Clear stereo audio, 44.1kHz
6. Generate a preview to check quality
7. Make adjustments as needed
8. Generate the final video
9. Download the video in MP4 format
10. Name the file according to the convention: `[avatar_type]_[clip_id].mp4`

## 4. Post-Processing and Integration

### Video Organization

1. Create a folder structure in the platform's storage:
   ```
   /public/videos/avatars/
   ├── teacher/
   ├── student/
   ├── special_needs/
   └── specialist/
   ```

2. Place each video in the appropriate folder

### Metadata Integration

1. Update the avatar metadata file with the actual video URLs:
   - Edit `/docs/ai_avatar_assets/avatar_metadata.json`
   - Add the `videoUrl` property to each clip object
   - Example: `"videoUrl": "/videos/avatars/teacher/teacher_welcome_introduction.mp4"`

### Platform Integration

1. Ensure the HeyGen service is properly configured in the platform:
   - Check `/src/lib/heygen/heygen-service.ts`
   - Verify that the service can access the generated videos

2. Test the video player component:
   - Navigate to `/src/app/ai-avatar-videos/view/[id]/page.tsx`
   - Ensure it can properly display the generated videos

## 5. GitHub Workflow

### Regular Commits

Make regular commits as you progress through the implementation:

```bash
# Initial commit with scripts and metadata
git add docs/ai_avatar_assets/
git commit -m "Add AI avatar scripts and metadata for Dr. Scott and other avatars"

# After generating each batch of videos
git add public/videos/avatars/teacher/
git commit -m "Add teacher avatar videos featuring Dr. Scott"

# After updating metadata with video URLs
git add docs/ai_avatar_assets/avatar_metadata.json
git commit -m "Update avatar metadata with video URLs"

# After testing integration
git add src/
git commit -m "Update components to integrate AI avatar videos"
```

### Pushing to GitHub

Push your changes to the GitHub repository:

```bash
git push origin main
```

## Testing

After implementation, thoroughly test the avatar videos:

1. Test playback on different devices and browsers
2. Verify that the correct avatar appears for each context
3. Check that audio is clear and synchronized
4. Ensure that videos load efficiently
5. Verify that the platform correctly handles video loading states

## Troubleshooting

### Common Issues

1. **Video Generation Failures**
   - Check that scripts are within HeyGen's character limits
   - Ensure API keys are valid and have sufficient credits
   - Try generating shorter segments if full videos fail

2. **Avatar Quality Issues**
   - Provide additional images if facial expressions are limited
   - Provide additional voice samples if speech sounds unnatural
   - Adjust lighting and background settings in HeyGen

3. **Integration Issues**
   - Verify file paths in the metadata file
   - Check browser console for errors
   - Ensure video formats are supported by all target browsers

## Contact

If you encounter issues that cannot be resolved using this guide, please contact the project lead for additional support.