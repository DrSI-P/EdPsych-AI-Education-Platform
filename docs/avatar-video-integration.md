# Avatar Video Integration Guide

## Overview

This document provides guidance for integrating avatar videos into the EdPsych-AI-Education-Platform. The platform is designed to support educational avatar videos across various components and pages.

## Current Video Placeholders

The platform currently contains the following video placeholders that need to be replaced with actual content:

1. **Introduction to Fractions** (`/assets/videos/fractions_intro.mp4`)
   - Duration: 240 seconds (4 minutes)
   - Target audience: Key Stage 2
   - Category: Lesson
   - Description: A comprehensive introduction to fractions for Key Stage 2 students

2. **Understanding Anxiety in the Classroom** (`/assets/videos/anxiety_classroom.mp4`)
   - Duration: 360 seconds (6 minutes)
   - Target audience: Teachers, SENCOs
   - Category: Tutorial
   - Description: Guidance for teachers on recognising and supporting students with anxiety

3. **Phonics Practice: Short Vowel Sounds** (`/assets/videos/phonics_vowels.mp4`)
   - Duration: 180 seconds (3 minutes)
   - Target audience: Early Years, Key Stage 1
   - Category: Tutorial
   - Description: Interactive phonics practice focusing on short vowel sounds

## Integration Points

The following components are responsible for displaying and managing avatar videos:

1. **Video Player Components**:
   - `src/components/avatar/video-player.tsx` - Main video player
   - `src/components/ai-avatar/ai-avatar-video-player.tsx` - AI-specific video player

2. **Video Library Components**:
   - `src/components/avatar/video-library.tsx` - Main video library
   - `src/components/ai-avatar/ai-avatar-video-library.tsx` - AI-specific video library

3. **Video Generation Components**:
   - `src/components/avatar/video-generator.tsx` - Video generation interface
   - `src/components/ai-avatar/video-generator.tsx` - AI-specific video generation

4. **API Routes**:
   - `src/app/api/ai-avatar/video/route.ts` - Video management API
   - `src/app/api/ai-avatar/video/[id]/route.ts` - Individual video API

## Integration Steps

To integrate your actual avatar videos:

1. **Prepare Video Assets**:
   - Create videos matching the placeholders' topics and durations
   - Ensure videos are in MP4 format with H.264 encoding for maximum compatibility
   - Prepare thumbnail images for each video (16:9 aspect ratio recommended)
   - Create caption files in WebVTT format if accessibility is required

2. **Configure Storage**:
   - Decide on storage solution (local storage, CDN, or cloud storage like AWS S3)
   - Update the video service configuration to point to your storage location

3. **Update Video References**:
   - Replace placeholder paths in mock data with actual video URLs
   - Update the video service to load your videos from the appropriate location

4. **Test Integration**:
   - Verify videos play correctly in all video players
   - Check that thumbnails display properly in the video libraries
   - Ensure captions work if provided

## Dynamic Video Loading

The platform supports dynamic loading of videos through the AI Avatar Video Service. To leverage this:

1. Implement the `getAllVideos()` method in `AIAvatarVideoService` to return your actual videos
2. Configure the service to connect to your video storage solution
3. Implement search functionality if needed

## Production Deployment Considerations

For a successful production deployment with avatar videos:

1. **Performance**:
   - Consider using a CDN for video delivery
   - Implement adaptive bitrate streaming for better user experience
   - Optimize video files for web delivery

2. **Accessibility**:
   - Provide captions for all videos
   - Consider audio descriptions for visually impaired users
   - Ensure video players are keyboard accessible

3. **Analytics**:
   - Implement video view tracking
   - Monitor bandwidth usage
   - Collect user engagement metrics

## Next Steps

1. Create or acquire the minimum 3 videos needed for initial deployment
2. Implement the integration steps outlined above
3. Test thoroughly across different devices and browsers
4. Deploy to production with monitoring in place
