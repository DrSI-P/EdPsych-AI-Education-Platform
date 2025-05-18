# Guided Restorative Conversation Frameworks

## Overview

The Guided Restorative Conversation Frameworks feature provides comprehensive, evidence-based tools for facilitating restorative conversations and conferences in educational settings. This feature supports educators in implementing restorative justice approaches to address conflicts, repair harm, and build stronger relationships within the school community.

## Key Features

### Evidence-Based Conversation Frameworks
- **Multiple Framework Types**: Includes frameworks for different scenarios (basic conversations, classroom circles, formal conferences, individual reflections, peer mediation)
- **Age-Appropriate Design**: Frameworks tailored for different educational stages (primary, secondary)
- **Comprehensive Structure**: Each framework includes clear steps, prompts, and facilitator guidance
- **Research-Backed Approach**: All frameworks are based on established restorative justice research and practice

### Interactive Conversation Facilitation
- **Step-by-Step Guidance**: Walks facilitators through each stage of the restorative process
- **Suggested Prompts**: Provides carefully crafted questions and statements for each step
- **Facilitator Notes**: Includes detailed guidance for managing the conversation effectively
- **Progress Tracking**: Visual indicators of conversation progress and completion

### Participant Management
- **Role Assignment**: Clearly defined roles for all participants (facilitator, person harmed, person responsible, supporters)
- **Flexible Configuration**: Supports various conversation types from one-on-one to large group conferences
- **Participant Tracking**: Records all individuals involved in each conversation

### Conversation Documentation
- **Structured Note-Taking**: Dedicated fields for recording responses and observations
- **Agreement Creation**: Tools for documenting restorative agreements
- **Outcome Tracking**: Records the results and effectiveness of each conversation
- **Historical Records**: Maintains searchable history of all restorative conversations

## Restorative Justice Principles

The Guided Restorative Conversation Frameworks feature is built on core restorative justice principles:

1. **Focus on Harm and Needs**: Conversations center on understanding the harm that occurred and identifying the needs of all involved parties.

2. **Emphasis on Obligations and Accountability**: The process encourages those responsible for harm to understand the impact of their actions and take steps to make things right.

3. **Engagement of Stakeholders**: All affected parties are included in the conversation and have a voice in the resolution process.

4. **Collaborative Problem-Solving**: Solutions and agreements are developed collectively rather than imposed by authority figures.

5. **Relationship-Centered Approach**: The ultimate goal is to repair and strengthen relationships within the school community.

## Evidence Base

The frameworks implemented in this feature are based on extensive research in restorative justice and educational psychology:

1. **Theoretical Foundations**: Draws on the work of restorative justice pioneers including Howard Zehr, Belinda Hopkins, and Margaret Thorsborne.

2. **Educational Adaptations**: Incorporates research on the effective application of restorative practices in school settings by researchers such as Brenda Morrison, Carolyn Boyes-Watson, and Kay Pranis.

3. **Effectiveness Research**: Supported by studies showing that well-implemented restorative approaches can reduce disciplinary incidents, improve school climate, and develop students' social-emotional skills.

4. **UK Educational Context**: Aligned with UK educational standards and the SEND Code of Practice, with particular attention to safeguarding requirements.

5. **User's Doctoral Research**: Incorporates key findings and frameworks from the platform owner's doctoral thesis on restorative approaches in educational psychology.

## Implementation Details

### Database Schema
The feature extends the Prisma schema with several new models:
- `RestorativeFramework`: Stores framework templates with steps and guidance
- `RestorativeConversation`: Records individual conversation instances
- `RestorativeParticipant`: Tracks participants and their roles
- `RestorativeAgreement`: Documents agreements and outcomes

### API Endpoints
- `GET /api/restorative-justice/conversation-frameworks`: Retrieves frameworks and conversations
- `POST /api/restorative-justice/conversation-frameworks`: Creates new frameworks or conversations
- `PATCH /api/restorative-justice/conversation-frameworks`: Updates existing frameworks or conversations
- `DELETE /api/restorative-justice/conversation-frameworks`: Removes frameworks or conversations

### Component Structure
- `RestorativeConversationFrameworks`: Main component with tabbed interface for frameworks, active conversations, and history
- Supporting components for framework selection, conversation facilitation, and history viewing

### Accessibility Considerations
- Clear visual indicators for conversation progress
- Consistent navigation patterns across the feature
- Screen reader optimized content structure
- Keyboard navigation support
- Clear feedback for all user actions

## Educational Impact

The Guided Restorative Conversation Frameworks feature supports several key educational outcomes:

1. **Improved Conflict Resolution Skills**: Students develop the ability to address conflicts constructively and repair harm.

2. **Enhanced School Climate**: Restorative approaches help create a more positive, supportive school environment.

3. **Reduced Exclusionary Discipline**: Provides alternatives to punitive measures that remove students from educational opportunities.

4. **Developed Social-Emotional Competencies**: Students practice empathy, perspective-taking, and responsible decision-making.

5. **Strengthened Community Relationships**: Builds stronger connections between students, staff, and the wider school community.

## References

1. Hopkins, B. (2004). Just Schools: A Whole School Approach to Restorative Justice. Jessica Kingsley Publishers.

2. Zehr, H. (2015). The Little Book of Restorative Justice: Revised and Updated. Good Books.

3. Thorsborne, M., & Blood, P. (2013). Implementing Restorative Practices in Schools. Jessica Kingsley Publishers.

4. Boyes-Watson, C., & Pranis, K. (2015). Circle Forward: Building a Restorative School Community. Living Justice Press.

5. Morrison, B. (2007). Restoring Safe School Communities: A Whole School Response to Bullying, Violence and Alienation. Federation Press.

6. Department for Education. (2015). Special educational needs and disability code of practice: 0 to 25 years. UK Government.
