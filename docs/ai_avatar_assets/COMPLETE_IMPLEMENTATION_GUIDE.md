# Complete AI Avatar Implementation Guide

This guide provides a comprehensive, step-by-step walkthrough for implementing AI avatar videos for the EdPsych-AI-Education-Platform, from beginning to end. This guide is designed to be accessible even if you're completely new to the process.

## Table of Contents

1. [Understanding the System](#understanding-the-system)
2. [Setting Up HeyGen](#setting-up-heygen)
3. [Creating Dr. Scott's Avatar](#creating-dr-scotts-avatar)
4. [Generating Videos](#generating-videos)
5. [Organizing and Integrating Videos](#organizing-and-integrating-videos)
6. [Committing and Pushing to GitHub](#committing-and-pushing-to-github)
7. [Troubleshooting](#troubleshooting)

## Understanding the System

### What is HeyGen?

HeyGen is an external AI video generation service that allows you to create realistic AI avatars and generate videos of them speaking. It's not part of the EdPsych-AI-Education-Platform itself, but our platform is designed to integrate with it.

### How the Platform Integrates with HeyGen

The EdPsych-AI-Education-Platform has components that connect to HeyGen:

1. **HeyGenService**: A service class that handles communication with the HeyGen API
2. **Video Viewer Component**: A component that displays the generated videos
3. **Directory Structure**: A place to store and organize the videos

## Setting Up HeyGen

### Step 1: Create a HeyGen Account

1. Go to [HeyGen's website](https://www.heygen.com/)
2. Click "Sign Up" or "Get Started"
3. Follow the registration process
4. Choose a plan that includes:
   - Custom avatar creation
   - Voice cloning
   - Commercial usage rights
   - API access

### Step 2: Get Your API Key

1. Log in to your HeyGen account
2. Navigate to your account settings or developer section
3. Look for "API Keys" or "Developer Tools"
4. Generate a new API key
5. Copy the API key to a secure location

### Step 3: Configure the Platform

1. Open the `.env` file in the root of the EdPsych-AI-Education-Platform
2. Add the following lines:
   ```
   NEXT_PUBLIC_HEYGEN_API_KEY=your_api_key_here
   NEXT_PUBLIC_HEYGEN_API_URL=https://api.heygen.com
   ```
3. Replace `your_api_key_here` with the API key you copied
4. Save the file

## Creating Dr. Scott's Avatar

### Step 1: Prepare Dr. Scott's Images

1. Collect high-quality images of Dr. Scott Ighavongbe-Patrick
2. Requirements:
   - Clear, high-resolution facial images
   - Multiple angles if possible (front, side profile)
   - Neutral expression and professional attire
   - Good lighting with minimal shadows
   - Plain background preferred
3. Save these images in a folder on your computer

### Step 2: Prepare Dr. Scott's Voice Sample

1. Collect voice recordings of Dr. Scott
2. Requirements:
   - Clear audio with minimal background noise
   - At least 2-3 minutes of continuous speech
   - Professional tone and pace
   - Variety of sentence structures and intonations
3. Save these recordings in a folder on your computer

### Step 3: Create the Avatar in HeyGen

1. Log in to your HeyGen account
2. Navigate to the "Avatars" or "Create Avatar" section
3. Select "Create Custom Avatar" or similar option
4. Upload Dr. Scott's images when prompted
5. Follow the platform's instructions to create the avatar
6. Wait for the avatar creation process to complete (this may take some time)

### Step 4: Clone Dr. Scott's Voice

1. In HeyGen, navigate to the "Voices" or "Voice Cloning" section
2. Select "Create New Voice" or similar option
3. Upload Dr. Scott's voice recordings
4. Name the voice "Dr_Scott_Voice" or similar
5. Follow the platform's instructions to clone the voice
6. Wait for the voice cloning process to complete (this may take some time)

### Step 5: Test the Avatar and Voice

1. In HeyGen, create a simple test video
2. Select Dr. Scott's avatar
3. Select Dr. Scott's cloned voice
4. Enter a simple test script (e.g., "Hello, I'm Dr. Scott Ighavongbe-Patrick.")
5. Generate the video
6. Review the video to ensure the avatar looks and sounds like Dr. Scott
7. Make adjustments as needed

## Generating Videos

### Step 1: Understand the Script Structure

The scripts for all avatar videos are organized in the following files:
- `/docs/ai_avatar_assets/teacher_avatar_clips.md` - For Dr. Scott's teacher avatar
- `/docs/ai_avatar_assets/student_peer_avatar_clips.md` - For student peer avatars
- `/docs/ai_avatar_assets/special_needs_support_avatar_clips.md` - For special needs support avatars
- `/docs/ai_avatar_assets/subject_specialist_avatar_clips.md` - For subject specialist avatars

Plus three full-length videos:
- `/docs/video_scripts/executive_summary_script.md`
- `/docs/video_scripts/platform_features_overview_script.md`
- `/docs/video_scripts/educational_psychology_foundations_script.md`

### Step 2: Generate Videos in Priority Order

Start with Dr. Scott's teacher avatar videos:

1. **Introduction Clips**
   - Open `/docs/ai_avatar_assets/teacher_avatar_clips.md`
   - Find the "Introduction Clips" section
   - For each script:
     - Log in to HeyGen
     - Create a new video project
     - Select Dr. Scott's avatar
     - Select Dr. Scott's voice
     - Copy the script content
     - Set the background according to the script specifications
     - Configure video settings (1080p, 16:9, 30fps)
     - Generate the video
     - Download the video in MP4 format
     - Name the file according to the convention: `teacher_dr_scott_introduction_welcome.mp4`

2. **Instructional Clips**
   - Follow the same process for the "Instructional Clips" section

3. **Emotional Support Clips**
   - Follow the same process for the "Emotional Support Clips" section

4. **Transition Clips**
   - Follow the same process for the "Transition Clips" section

5. **Full-Length Videos**
   - Follow the same process for the full-length videos, using the scripts from the `/docs/video_scripts/` directory

### Step 3: Generate Other Avatar Videos

After completing Dr. Scott's videos, follow the same process for:
1. Student Peer Avatar videos
2. Special Needs Support Avatar videos
3. Subject Specialist Avatar videos

## Organizing and Integrating Videos

### Step 1: Organize the Videos

1. Place the generated videos in the appropriate directories:
   - Dr. Scott's videos: `EdPsych-AI-Education-Platform/public/videos/avatars/teacher/`
   - Student videos: `EdPsych-AI-Education-Platform/public/videos/avatars/student/`
   - Special needs videos: `EdPsych-AI-Education-Platform/public/videos/avatars/special_needs/`
   - Specialist videos: `EdPsych-AI-Education-Platform/public/videos/avatars/specialist/`

2. Within each directory, you can further organize by category:
   - `introduction/`
   - `instructional/`
   - `emotional_support/`
   - `transition/`
   - `full_length/`

### Step 2: Update the Metadata

1. Open `EdPsych-AI-Education-Platform/docs/ai_avatar_assets/avatar_metadata.json`
2. For each video you've generated, add the `videoUrl` property to the corresponding clip object
3. Example:
   ```json
   {
     "id": "welcome_introduction",
     "title": "Welcome Introduction",
     "duration": 30,
     "category": "introduction",
     "scriptPath": "/docs/ai_avatar_assets/teacher_avatar_clips.md#welcome-introduction",
     "videoUrl": "/videos/avatars/teacher/introduction/teacher_dr_scott_introduction_welcome.mp4"
   }
   ```
4. Save the file

## Committing and Pushing to GitHub

### Step 1: Initial Commit

1. Open a command prompt or terminal
2. Navigate to the root directory of the EdPsych-AI-Education-Platform
3. Run the initial commit script:
   ```
   scripts\initial-avatar-commit.bat
   ```
4. This will commit all the script files, metadata, and implementation guides

### Step 2: Commit Generated Videos

After generating and organizing the videos:

1. Open a command prompt or terminal
2. Navigate to the root directory of the EdPsych-AI-Education-Platform
3. Run the commit script:
   ```
   scripts\commit-avatar-assets.bat
   ```
4. Select option 4 to commit generated videos
5. Enter the path to the video files (e.g., `public/videos/avatars/teacher`)
6. Repeat for each avatar type

### Step 3: Commit Updated Metadata

After updating the metadata with video URLs:

1. Open a command prompt or terminal
2. Navigate to the root directory of the EdPsych-AI-Education-Platform
3. Run the commit script:
   ```
   scripts\commit-avatar-assets.bat
   ```
4. Select option 2 to commit metadata files

## Troubleshooting

### HeyGen Issues

1. **Avatar Creation Fails**
   - Ensure images meet the requirements (clear, high-resolution, etc.)
   - Try using different images
   - Contact HeyGen support if issues persist

2. **Voice Cloning Fails**
   - Ensure voice samples meet the requirements (clear audio, sufficient length, etc.)
   - Try using different voice samples
   - Contact HeyGen support if issues persist

3. **Video Generation Fails**
   - Check that scripts are within HeyGen's character limits
   - Ensure API keys are valid and have sufficient credits
   - Try generating shorter segments if full videos fail

### Platform Integration Issues

1. **Videos Don't Appear in the Platform**
   - Verify file paths in the metadata file
   - Check browser console for errors
   - Ensure video formats are supported by all target browsers

2. **GitHub Commit Issues**
   - Ensure you're running the scripts from the root directory
   - Check that Git is installed and configured
   - Try committing manually if scripts fail

## Conclusion

By following this guide, you should be able to successfully implement AI avatar videos for the EdPsych-AI-Education-Platform, from setting up HeyGen to generating videos and integrating them into the platform.

If you encounter any issues not covered in this guide, please contact the project lead for additional support.