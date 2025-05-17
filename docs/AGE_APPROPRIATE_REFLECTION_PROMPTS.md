# Age-Appropriate Reflection Prompts

## Overview
The Age-Appropriate Reflection Prompts feature provides developmentally appropriate reflection prompts for students at different age levels within the restorative justice framework. This feature supports educators in facilitating meaningful reflection with students of all ages, using language and concepts that match their developmental stage.

## Key Components

### 1. Comprehensive Prompt Library
- Age-appropriate prompts categorized by developmental stage (Early Years 3-5, Primary 5-11, Secondary 11-18, Staff)
- Different prompt types for various restorative scenarios (self-awareness, incident reflection, making amends, etc.)
- Supporting questions to guide deeper reflection
- Visual supports for younger students

### 2. Interactive Prompt Browser
- Searchable and filterable prompt collection
- Detailed view of each prompt with supporting questions
- Usage guidelines and facilitation tips
- Export functionality for offline use

### 3. Custom Prompt Creation
- Tools for creating and saving personalized prompts
- Age group and category selection
- Supporting question management
- Adaptation options (simplified language, visual supports)

### 4. Developmental Considerations
- Early Years (3-5): Simple language, concrete concepts, visual supports, focus on basic emotions and actions
- Primary (5-11): Developing empathy, understanding impact, exploring choices, community awareness
- Secondary (11-18): Complex reflection, perspective-taking, values alignment, relationship impact, future planning
- Staff: Facilitation reflection, relationship building, professional development

## Evidence Base
The Age-Appropriate Reflection Prompts feature is grounded in established research from:

- **Developmental Psychology**: Aligns with cognitive and social-emotional development stages
- **Restorative Justice Research**: Incorporates key restorative questions adapted for different age groups
- **Educational Psychology**: Follows best practices for scaffolding reflection based on developmental readiness
- **UK Educational Context**: Aligned with UK educational standards and the SEND Code of Practice

## Implementation Details

### Frontend Components
- `AgeAppropriateReflectionPrompts`: Main component providing the prompt library, browser, and creation tools
- Responsive design with accessibility considerations
- Interactive elements for prompt selection, customization, and management

### Backend API
- RESTful endpoints for prompt management (GET, POST, PUT, DELETE)
- Secure validation and error handling
- Integration with user authentication and database

### Database Schema
- `ReflectionPrompt` model with comprehensive fields for all prompt components
- Relationships with User model for personalized experiences
- Support for prompt customization and sharing

## User Benefits
- **For Teachers**: Provides developmentally appropriate tools for facilitating reflection with students of all ages
- **For Students**: Offers accessible reflection prompts that match their cognitive and emotional development
- **For Schools**: Supports whole-school restorative approaches with consistent, age-appropriate reflection practices

## Accessibility Considerations
- All components are keyboard navigable
- Color contrast meets WCAG standards
- Screen reader optimizations
- Visual supports for younger students
- Simplified language options

## Future Enhancements
- Integration with digital journaling tools
- Expanded visual support library
- Additional language adaptations for EAL students
- Integration with IEP/504 plans for students with special educational needs
