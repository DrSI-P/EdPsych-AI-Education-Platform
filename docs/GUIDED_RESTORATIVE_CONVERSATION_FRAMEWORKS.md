# Guided Restorative Conversation Frameworks

## Overview
This document outlines the implementation of the Guided Restorative Conversation Frameworks feature for the EdPsych-AI-Education-Platform. This feature provides educators with evidence-based tools for conducting restorative conversations based on restorative justice principles derived from educational psychology research.

## Evidence Base
The implementation is grounded in established restorative justice frameworks and principles, including:

1. **The Social Discipline Window** (McCold & Wachtel) - A framework that distinguishes between four approaches to behavior management:
   - Punitive (TO): High control, low support
   - Neglectful (NOT): Low control, low support
   - Permissive (FOR): Low control, high support
   - Restorative (WITH): High control, high support

2. **Core Restorative Principles**:
   - Relationships First: Prioritizing relationship building and repair
   - Responsibility and Accountability: Encouraging ownership of actions and their impact
   - Inclusive Decision-Making: Involving all affected parties in the resolution process
   - Healing and Growth: Focusing on healing harm rather than punishment

3. **Continuum of Restorative Practices**:
   - Preventative: Community building circles, classroom agreements
   - Responsive: Problem-solving circles, restorative conversations
   - Intensive: Formal conferences, reintegration meetings

## Key Features

### 1. Comprehensive Framework Library
- Multiple pre-defined conversation frameworks for different scenarios and age groups
- Each framework includes detailed steps with descriptions and suggested questions/prompts
- Frameworks are categorized by age group (primary, secondary, all) and scenario type

### 2. Step-by-Step Guidance
- Structured conversation flow with clear progression through restorative process
- Detailed instructions and prompts for each stage of the conversation
- Supporting guidance notes with facilitator tips and best practices

### 3. Customization Options
- Ability to create and save custom frameworks
- Adaptable question prompts for different contexts and needs
- Filtering and search functionality for finding appropriate frameworks

### 4. Documentation Tools
- Record-keeping for conversation participants and outcomes
- Agreement tracking and follow-up planning
- Integration with student support records

### 5. Educational Resources
- Comprehensive explanation of restorative justice principles
- Training materials and practice scenarios
- Research evidence supporting restorative approaches

## Implementation Details

### Component Structure
The feature is implemented as a React component with multiple tabs:
1. **Frameworks Tab**: Browse and select from available frameworks
2. **Conversation Guide Tab**: Step-by-step guidance for conducting the conversation
3. **Create Custom Tab**: Design and save custom frameworks
4. **Resources Tab**: Educational materials and evidence base

### API Integration
The feature includes API endpoints for:
- Retrieving frameworks with filtering options
- Saving custom frameworks
- Recording conversation outcomes
- Managing documentation

### Accessibility Considerations
- Responsive design for all device sizes
- Keyboard navigation support
- Clear visual hierarchy and readable text
- Semantic HTML structure

### Safeguarding Compliance
- Secure storage of sensitive conversation data
- Role-based access controls
- Alignment with UK safeguarding requirements
- Privacy-preserving documentation practices

## UK Educational Alignment
The implementation aligns with UK educational standards and practices:
- Compatible with SEND Code of Practice approaches to behavior management
- Supports whole-school approaches to positive behavior
- Complements existing pastoral care systems
- Provides alternatives to exclusionary discipline practices

## Future Enhancements
Potential future enhancements could include:
- Integration with behavior tracking systems
- Advanced analytics for identifying patterns and measuring outcomes
- Additional frameworks for specific contexts (e.g., online behavior)
- Enhanced collaboration tools for multi-professional involvement

## References
1. McCold, P., & Wachtel, T. (2003). In pursuit of paradigm: A theory of restorative justice. International Institute for Restorative Practices.
2. Hopkins, B. (2004). Just schools: A whole school approach to restorative justice. Jessica Kingsley Publishers.
3. Thorsborne, M., & Blood, P. (2013). Implementing restorative practices in schools: A practical guide to transforming school communities. Jessica Kingsley Publishers.
4. Department for Education. (2022). Behaviour in schools: Advice for headteachers and school staff.
