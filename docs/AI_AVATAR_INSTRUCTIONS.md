# AI Video Avatar Assets Creation Instructions

## Overview

This document provides instructions for creating AI video avatar assets for the EdPsych-AI-Education-Platform. These avatars will be used throughout the platform to provide a more engaging and personalized learning experience for users.

## Repository Information

- **GitHub URL**: https://github.com/DrSI-P/EdPsych-AI-Education-Platform
- **Related Files**: 
  - `/src/app/ai-avatar-videos/view/[id]/page.tsx` - Avatar video viewer component
  - Other avatar-related components in the codebase

## Requirements

### Avatar Types

We need to create several types of AI video avatars:

1. **Teacher Avatars**
   - Professional appearance
   - Clear speaking voice
   - Diverse representation (different genders, ethnicities, ages)
   - Appropriate for educational context

2. **Student Avatars**
   - Age-appropriate for different educational levels
   - Diverse representation
   - Relatable to the target student audience

3. **Special Needs Support Avatars**
   - Avatars specifically designed to support students with special educational needs
   - May include avatars that demonstrate emotional regulation, social skills, etc.

### Technical Specifications

- **Video Format**: MP4
- **Resolution**: 1080p (1920x1080)
- **Aspect Ratio**: 16:9
- **Frame Rate**: 30fps
- **Audio**: Clear stereo audio, 44.1kHz
- **Duration**: 30-60 seconds per clip
- **Background**: Neutral, non-distracting background (preferably with green screen option)

### Content Requirements

For each avatar, we need the following content variations:

1. **Introduction clips**
   - Avatar introducing themselves
   - Welcoming students to the platform

2. **Instructional clips**
   - Explaining concepts
   - Giving directions for activities
   - Providing feedback

3. **Emotional support clips**
   - Encouraging messages
   - Celebrating achievements
   - Providing reassurance

4. **Transition clips**
   - Moving between activities
   - Starting and ending sessions

## Implementation

### Creation Process

1. **Script Writing**
   - Develop scripts for each avatar and content type
   - Ensure language is age-appropriate and educationally sound
   - Include variations for different contexts

2. **Avatar Generation**
   - Use a high-quality AI avatar generation platform (e.g., Synthesia, D-ID, HeyGen)
   - Select appropriate avatar models
   - Configure settings for optimal educational use

3. **Video Production**
   - Generate videos using the scripts
   - Review for quality and appropriateness
   - Make adjustments as needed

4. **Post-Processing**
   - Edit videos if necessary
   - Ensure consistent audio levels
   - Add any necessary overlays or effects

### Integration with Platform

1. **File Organisation**
   - Create a structured folder system for the avatars
   - Name files consistently for easy reference
   - Example: `[avatar_type]_[avatar_name]_[content_type]_[variation].mp4`

2. **Metadata**
   - Create a JSON file with metadata for each avatar video
   - Include information such as:
     - Avatar name
     - Content type
     - Duration
     - Transcript
     - Tags for searchability

3. **Storage**
   - Upload videos to an appropriate cloud storage solution
   - Ensure videos are optimised for streaming
   - Set up proper access controls

4. **Database Integration**
   - Update the database with references to the avatar videos
   - Link videos to appropriate content in the platform

## Priority List

Please create the following avatars as a priority:

1. Main teacher avatar (professional, approachable)
2. Student peer avatar (relatable to target age group)
3. Special needs support avatar (focused on emotional regulation)
4. Subject specialist avatars (for specific educational topics)

## Timeline

- **Week 1**: Script development and avatar selection
- **Week 2**: Initial video generation and review
- **Week 3**: Refinements and additional content creation
- **Week 4**: Final production, post-processing, and integration

## Resources

- [Synthesia](https://www.synthesia.io/) - AI video generation platform
- [D-ID](https://www.d-id.com/) - AI avatar creation
- [HeyGen](https://www.heygen.com/) - AI video platform
- [Elevenlabs](https://elevenlabs.io/) - AI voice generation

## Contact

If you have any questions or need clarification on these requirements, please contact the project lead.

## Next Steps

1. Review the existing avatar-related code in the repository
2. Develop initial scripts for the priority avatars
3. Select appropriate AI generation platform
4. Create test videos for review
5. Proceed with full production once approved