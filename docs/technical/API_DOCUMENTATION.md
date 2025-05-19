# API Documentation for EdPsych-AI-Education-Platform

## Overview

This document provides comprehensive documentation for the APIs available in the EdPsych-AI-Education-Platform. These APIs enable integration with the platform's features and services, allowing for custom client applications, data analysis, and third-party integrations.

## API Standards

### RESTful API Design

The EdPsych-AI-Education-Platform follows RESTful API design principles:

- Resource-oriented URLs
- Standard HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Appropriate HTTP status codes
- JSON as the primary data format
- Consistent error handling
- Authentication via JWT tokens
- Rate limiting for API stability

### GraphQL API Design

For more complex data requirements, GraphQL APIs are available:

- Single endpoint (`/api/graphql`)
- Schema-based queries
- Type-safe responses
- Efficient data retrieval
- Real-time subscriptions for live updates
- Detailed error information

### Authentication

All APIs require authentication unless explicitly marked as public:

- JWT-based authentication
- Tokens provided in Authorization header
- Role-based access control
- Scoped permissions

### Versioning

APIs are versioned to ensure backward compatibility:

- Version included in URL path (`/api/v1/resource`)
- Deprecation notices provided before removing older versions
- Minimum 6-month support for deprecated versions

### Rate Limiting

To ensure platform stability and fair usage:

- 100 requests per minute per authenticated user
- 10 requests per minute for unauthenticated endpoints
- 429 Too Many Requests response when limit exceeded
- Rate limit headers included in responses

## API Endpoints

### User Management API

#### Get Current User

```
GET /api/v1/users/me
```

Retrieves the profile of the currently authenticated user.

**Authentication Required:** Yes

**Response Example:**
```json
{
  "id": "user_123456",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "role": "teacher",
  "organisation": "Example School",
  "preferences": {
    "theme": "light",
    "notifications": true,
    "ageGroup": "secondary"
  },
  "createdAt": "2025-01-15T12:00:00Z",
  "updatedAt": "2025-05-10T14:30:00Z"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 500: Server Error

#### Update User Profile

```
PATCH /api/v1/users/me
```

Updates the profile of the currently authenticated user.

**Authentication Required:** Yes

**Request Body Example:**
```json
{
  "firstName": "Jonathan",
  "lastName": "Smith",
  "preferences": {
    "theme": "dark",
    "notifications": false
  }
}
```

**Response Example:**
```json
{
  "id": "user_123456",
  "email": "user@example.com",
  "firstName": "Jonathan",
  "lastName": "Smith",
  "role": "teacher",
  "organisation": "Example School",
  "preferences": {
    "theme": "dark",
    "notifications": false,
    "ageGroup": "secondary"
  },
  "createdAt": "2025-01-15T12:00:00Z",
  "updatedAt": "2025-05-19T09:45:00Z"
}
```

**Status Codes:**
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 500: Server Error

#### Get User by ID (Admin Only)

```
GET /api/v1/users/:id
```

Retrieves a user by their ID. Restricted to administrators.

**Authentication Required:** Yes (Admin role)

**Path Parameters:**
- id: The unique identifier of the user

**Response Example:**
```json
{
  "id": "user_789012",
  "email": "student@example.com",
  "firstName": "Emma",
  "lastName": "Jones",
  "role": "student",
  "organisation": "Example School",
  "preferences": {
    "theme": "light",
    "notifications": true,
    "ageGroup": "secondary"
  },
  "createdAt": "2025-02-20T10:15:00Z",
  "updatedAt": "2025-05-18T11:30:00Z"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

### Learning Content API

#### Get Learning Modules

```
GET /api/v1/learning/modules
```

Retrieves a list of learning modules available to the user.

**Authentication Required:** Yes

**Query Parameters:**
- page: Page number (default: 1)
- limit: Items per page (default: 20, max: 100)
- subject: Filter by subject
- ageGroup: Filter by age group
- searchTerm: Search in title and description

**Response Example:**
```json
{
  "data": [
    {
      "id": "module_123456",
      "title": "Introduction to Algebra",
      "description": "Learn the basics of algebraic expressions and equations",
      "subject": "Mathematics",
      "ageGroup": "secondary",
      "level": "intermediate",
      "estimatedDuration": 120,
      "thumbnailUrl": "https://assets.edpsychconnect.com/thumbnails/algebra-intro.jpg",
      "createdAt": "2025-03-10T09:00:00Z",
      "updatedAt": "2025-05-15T14:20:00Z"
    },
    {
      "id": "module_789012",
      "title": "Reading Comprehension Strategies",
      "description": "Effective strategies for understanding and analysing texts",
      "subject": "English",
      "ageGroup": "primary",
      "level": "beginner",
      "estimatedDuration": 90,
      "thumbnailUrl": "https://assets.edpsychconnect.com/thumbnails/reading-comp.jpg",
      "createdAt": "2025-02-05T11:30:00Z",
      "updatedAt": "2025-05-12T10:15:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

**Status Codes:**
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 500: Server Error

#### Get Module Details

```
GET /api/v1/learning/modules/:id
```

Retrieves detailed information about a specific learning module.

**Authentication Required:** Yes

**Path Parameters:**
- id: The unique identifier of the module

**Response Example:**
```json
{
  "id": "module_123456",
  "title": "Introduction to Algebra",
  "description": "Learn the basics of algebraic expressions and equations",
  "subject": "Mathematics",
  "ageGroup": "secondary",
  "level": "intermediate",
  "estimatedDuration": 120,
  "thumbnailUrl": "https://assets.edpsychconnect.com/thumbnails/algebra-intro.jpg",
  "objectives": [
    "Understand algebraic notation",
    "Solve simple equations",
    "Apply algebraic concepts to real-world problems"
  ],
  "prerequisites": [
    "Basic arithmetic operations",
    "Understanding of variables"
  ],
  "sections": [
    {
      "id": "section_123",
      "title": "Algebraic Expressions",
      "order": 1,
      "content": [
        {
          "id": "content_456",
          "type": "video",
          "title": "Introduction to Expressions",
          "url": "https://assets.edpsychconnect.com/videos/algebra-expressions.mp4",
          "duration": 10
        },
        {
          "id": "content_457",
          "type": "text",
          "title": "Working with Variables",
          "content": "Variables are symbols that represent numbers..."
        }
      ]
    },
    {
      "id": "section_124",
      "title": "Solving Equations",
      "order": 2,
      "content": [
        {
          "id": "content_458",
          "type": "interactive",
          "title": "Equation Solver",
          "url": "https://interactive.edpsychconnect.com/equation-solver"
        }
      ]
    }
  ],
  "assessments": [
    {
      "id": "assessment_789",
      "title": "Module Quiz",
      "type": "quiz",
      "questionCount": 10,
      "passingScore": 70,
      "estimatedDuration": 15
    }
  ],
  "resources": [
    {
      "id": "resource_101",
      "title": "Algebra Cheat Sheet",
      "type": "pdf",
      "url": "https://assets.edpsychconnect.com/resources/algebra-cheatsheet.pdf"
    }
  ],
  "createdAt": "2025-03-10T09:00:00Z",
  "updatedAt": "2025-05-15T14:20:00Z"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

#### Create Learning Module (Educator Only)

```
POST /api/v1/learning/modules
```

Creates a new learning module. Restricted to educators and administrators.

**Authentication Required:** Yes (Educator or Admin role)

**Request Body Example:**
```json
{
  "title": "Introduction to Photosynthesis",
  "description": "Learn how plants convert light energy into chemical energy",
  "subject": "Science",
  "ageGroup": "late-primary",
  "level": "intermediate",
  "estimatedDuration": 90,
  "objectives": [
    "Understand the process of photosynthesis",
    "Identify factors affecting photosynthesis",
    "Explain the importance of photosynthesis in ecosystems"
  ],
  "prerequisites": [
    "Basic understanding of plant biology",
    "Knowledge of cellular structures"
  ]
}
```

**Response Example:**
```json
{
  "id": "module_345678",
  "title": "Introduction to Photosynthesis",
  "description": "Learn how plants convert light energy into chemical energy",
  "subject": "Science",
  "ageGroup": "late-primary",
  "level": "intermediate",
  "estimatedDuration": 90,
  "thumbnailUrl": null,
  "objectives": [
    "Understand the process of photosynthesis",
    "Identify factors affecting photosynthesis",
    "Explain the importance of photosynthesis in ecosystems"
  ],
  "prerequisites": [
    "Basic understanding of plant biology",
    "Knowledge of cellular structures"
  ],
  "sections": [],
  "assessments": [],
  "resources": [],
  "createdAt": "2025-05-19T10:00:00Z",
  "updatedAt": "2025-05-19T10:00:00Z"
}
```

**Status Codes:**
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 500: Server Error

### Assessment API

#### Get Assessments

```
GET /api/v1/assessments
```

Retrieves a list of assessments available to the user.

**Authentication Required:** Yes

**Query Parameters:**
- page: Page number (default: 1)
- limit: Items per page (default: 20, max: 100)
- subject: Filter by subject
- ageGroup: Filter by age group
- type: Filter by assessment type
- moduleId: Filter by associated module

**Response Example:**
```json
{
  "data": [
    {
      "id": "assessment_123456",
      "title": "Algebra End of Unit Test",
      "description": "Comprehensive assessment of algebraic concepts",
      "subject": "Mathematics",
      "ageGroup": "secondary",
      "type": "test",
      "questionCount": 20,
      "estimatedDuration": 45,
      "passingScore": 70,
      "moduleId": "module_123456",
      "createdAt": "2025-03-15T13:00:00Z",
      "updatedAt": "2025-05-10T09:30:00Z"
    },
    {
      "id": "assessment_789012",
      "title": "Reading Comprehension Quiz",
      "description": "Quick check of reading comprehension strategies",
      "subject": "English",
      "ageGroup": "primary",
      "type": "quiz",
      "questionCount": 10,
      "estimatedDuration": 15,
      "passingScore": 60,
      "moduleId": "module_789012",
      "createdAt": "2025-02-10T14:45:00Z",
      "updatedAt": "2025-05-05T11:20:00Z"
    }
  ],
  "pagination": {
    "total": 38,
    "page": 1,
    "limit": 20,
    "pages": 2
  }
}
```

**Status Codes:**
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 500: Server Error

#### Get Assessment Details

```
GET /api/v1/assessments/:id
```

Retrieves detailed information about a specific assessment.

**Authentication Required:** Yes

**Path Parameters:**
- id: The unique identifier of the assessment

**Response Example:**
```json
{
  "id": "assessment_123456",
  "title": "Algebra End of Unit Test",
  "description": "Comprehensive assessment of algebraic concepts",
  "subject": "Mathematics",
  "ageGroup": "secondary",
  "type": "test",
  "questionCount": 20,
  "estimatedDuration": 45,
  "passingScore": 70,
  "moduleId": "module_123456",
  "instructions": "Answer all questions. Show your work for calculation problems.",
  "questions": [
    {
      "id": "question_101",
      "type": "multiple-choice",
      "text": "Which of the following is equivalent to 3(x + 2)?",
      "options": [
        "3x + 2",
        "3x + 6",
        "3x + 5",
        "3x + 8"
      ],
      "correctOption": 1,
      "points": 5
    },
    {
      "id": "question_102",
      "type": "text-input",
      "text": "Solve for x: 2x + 5 = 15",
      "correctAnswer": "5",
      "points": 10
    }
  ],
  "createdAt": "2025-03-15T13:00:00Z",
  "updatedAt": "2025-05-10T09:30:00Z"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

#### Submit Assessment

```
POST /api/v1/assessments/:id/submissions
```

Submits a completed assessment for grading.

**Authentication Required:** Yes

**Path Parameters:**
- id: The unique identifier of the assessment

**Request Body Example:**
```json
{
  "answers": [
    {
      "questionId": "question_101",
      "selectedOption": 1
    },
    {
      "questionId": "question_102",
      "textInput": "5"
    }
  ],
  "timeSpent": 1800
}
```

**Response Example:**
```json
{
  "id": "submission_345678",
  "assessmentId": "assessment_123456",
  "userId": "user_123456",
  "score": 15,
  "totalPoints": 15,
  "percentage": 100,
  "passed": true,
  "timeSpent": 1800,
  "submittedAt": "2025-05-19T10:30:00Z",
  "gradedAt": "2025-05-19T10:30:01Z",
  "feedback": "Excellent work! You've demonstrated a strong understanding of algebraic concepts.",
  "questionResults": [
    {
      "questionId": "question_101",
      "correct": true,
      "points": 5,
      "feedback": "Correct! 3(x + 2) = 3x + 6"
    },
    {
      "questionId": "question_102",
      "correct": true,
      "points": 10,
      "feedback": "Correct! 2x + 5 = 15 → 2x = 10 → x = 5"
    }
  ]
}
```

**Status Codes:**
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

### AI Avatar API

#### Generate Avatar Video

```
POST /api/v1/ai-avatar/generate
```

Generates an AI avatar video from a provided script.

**Authentication Required:** Yes (Educator or Admin role)

**Request Body Example:**
```json
{
  "script": "Today we're going to learn about photosynthesis, the process plants use to create energy from sunlight.",
  "avatarStyle": "teacher",
  "ageGroup": "late-primary",
  "voice": "british-female",
  "duration": "short",
  "background": "classroom"
}
```

**Response Example:**
```json
{
  "id": "avatar_123456",
  "status": "processing",
  "estimatedCompletionTime": "2025-05-19T11:00:00Z",
  "script": "Today we're going to learn about photosynthesis, the process plants use to create energy from sunlight.",
  "avatarStyle": "teacher",
  "ageGroup": "late-primary",
  "voice": "british-female",
  "duration": "short",
  "background": "classroom",
  "createdAt": "2025-05-19T10:45:00Z",
  "updatedAt": "2025-05-19T10:45:00Z"
}
```

**Status Codes:**
- 202: Accepted
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 500: Server Error

#### Get Avatar Video Status

```
GET /api/v1/ai-avatar/:id
```

Checks the status of an AI avatar video generation request.

**Authentication Required:** Yes

**Path Parameters:**
- id: The unique identifier of the avatar generation request

**Response Example:**
```json
{
  "id": "avatar_123456",
  "status": "completed",
  "script": "Today we're going to learn about photosynthesis, the process plants use to create energy from sunlight.",
  "avatarStyle": "teacher",
  "ageGroup": "late-primary",
  "voice": "british-female",
  "duration": "short",
  "background": "classroom",
  "videoUrl": "https://assets.edpsychconnect.com/avatars/avatar_123456.mp4",
  "thumbnailUrl": "https://assets.edpsychconnect.com/avatars/avatar_123456_thumb.jpg",
  "createdAt": "2025-05-19T10:45:00Z",
  "completedAt": "2025-05-19T10:55:00Z",
  "updatedAt": "2025-05-19T10:55:00Z"
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

### Analytics API

#### Get User Progress

```
GET /api/v1/analytics/progress
```

Retrieves learning progress data for the current user.

**Authentication Required:** Yes

**Query Parameters:**
- startDate: Filter by start date (ISO format)
- endDate: Filter by end date (ISO format)
- subject: Filter by subject

**Response Example:**
```json
{
  "userId": "user_123456",
  "overallProgress": {
    "modulesStarted": 12,
    "modulesCompleted": 8,
    "assessmentsTaken": 15,
    "assessmentsPassed": 13,
    "totalTimeSpent": 3600,
    "averageScore": 85
  },
  "subjectProgress": [
    {
      "subject": "Mathematics",
      "modulesStarted": 5,
      "modulesCompleted": 4,
      "assessmentsTaken": 7,
      "assessmentsPassed": 6,
      "totalTimeSpent": 1800,
      "averageScore": 88
    },
    {
      "subject": "Science",
      "modulesStarted": 4,
      "modulesCompleted": 2,
      "assessmentsTaken": 5,
      "assessmentsPassed": 4,
      "totalTimeSpent": 1200,
      "averageScore": 82
    },
    {
      "subject": "English",
      "modulesStarted": 3,
      "modulesCompleted": 2,
      "assessmentsTaken": 3,
      "assessmentsPassed": 3,
      "totalTimeSpent": 600,
      "averageScore": 90
    }
  ],
  "recentActivity": [
    {
      "type": "module_completion",
      "moduleId": "module_123456",
      "moduleTitle": "Introduction to Algebra",
      "completedAt": "2025-05-18T14:30:00Z"
    },
    {
      "type": "assessment_submission",
      "assessmentId": "assessment_123456",
      "assessmentTitle": "Algebra End of Unit Test",
      "score": 85,
      "passed": true,
      "submittedAt": "2025-05-18T15:00:00Z"
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 500: Server Error

#### Get Class Progress (Educator Only)

```
GET /api/v1/analytics/class/:classId/progress
```

Retrieves learning progress data for a class. Restricted to educators and administrators.

**Authentication Required:** Yes (Educator or Admin role)

**Path Parameters:**
- classId: The unique identifier of the class

**Query Parameters:**
- startDate: Filter by start date (ISO format)
- endDate: Filter by end date (ISO format)
- subject: Filter by subject

**Response Example:**
```json
{
  "classId": "class_123456",
  "className": "Year 8 Mathematics",
  "overallProgress": {
    "studentCount": 25,
    "modulesStarted": 150,
    "modulesCompleted": 120,
    "assessmentsTaken": 200,
    "assessmentsPassed": 180,
    "averageScore": 82
  },
  "subjectProgress": [
    {
      "subject": "Mathematics",
      "modulesStarted": 150,
      "modulesCompleted": 120,
      "assessmentsTaken": 200,
      "assessmentsPassed": 180,
      "averageScore": 82
    }
  ],
  "studentProgress": [
    {
      "userId": "user_789012",
      "firstName": "Emma",
      "lastName": "Jones",
      "modulesStarted": 6,
      "modulesCompleted": 5,
      "assessmentsTaken": 8,
      "assessmentsPassed": 7,
      "averageScore": 88
    },
    {
      "userId": "user_345678",
      "firstName": "James",
      "lastName": "Wilson",
      "modulesStarted": 6,
      "modulesCompleted": 4,
      "assessmentsTaken": 8,
      "assessmentsPassed": 6,
      "averageScore": 75
    }
  ]
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## GraphQL API

### Endpoint

```
POST /api/graphql
```

### Authentication

GraphQL requests require the same authentication as REST APIs:

- JWT token in Authorization header
- Role-based access control

### Schema

The GraphQL schema defines the available queries, mutations, and types:

```graphql
type Query {
  # User queries
  me: User!
  user(id: ID!): User
  users(page: Int, limit: Int, role: String): UserConnection!
  
  # Learning content queries
  modules(page: Int, limit: Int, subject: String, ageGroup: String, searchTerm: String): ModuleConnection!
  module(id: ID!): Module
  
  # Assessment queries
  assessments(page: Int, limit: Int, subject: String, ageGroup: String, type: String, moduleId: ID): AssessmentConnection!
  assessment(id: ID!): Assessment
  submission(id: ID!): Submission
  submissions(assessmentId: ID, userId: ID, page: Int, limit: Int): SubmissionConnection!
  
  # Analytics queries
  userProgress(userId: ID, startDate: String, endDate: String, subject: String): UserProgress!
  classProgress(classId: ID!, startDate: String, endDate: String, subject: String): ClassProgress!
}

type Mutation {
  # User mutations
  updateUserProfile(input: UpdateUserProfileInput!): User!
  
  # Learning content mutations
  createModule(input: CreateModuleInput!): Module!
  updateModule(id: ID!, input: UpdateModuleInput!): Module!
  deleteModule(id: ID!): Boolean!
  
  # Assessment mutations
  createAssessment(input: CreateAssessmentInput!): Assessment!
  updateAssessment(id: ID!, input: UpdateAssessmentInput!): Assessment!
  deleteAssessment(id: ID!): Boolean!
  submitAssessment(id: ID!, input: SubmitAssessmentInput!): Submission!
  
  # AI Avatar mutations
  generateAvatarVideo(input: GenerateAvatarInput!): AvatarGeneration!
}

# Type definitions for User
type User {
  id: ID!
  email: String!
  firstName: String!
  lastName: String!
  role: String!
  organisation: String
  preferences: UserPreferences
  createdAt: String!
  updatedAt: String!
}

type UserPreferences {
  theme: String!
  notifications: Boolean!
  ageGroup: String!
}

type UserConnection {
  data: [User!]!
  pagination: Pagination!
}

# Type definitions for Learning Content
type Module {
  id: ID!
  title: String!
  description: String!
  subject: String!
  ageGroup: String!
  level: String!
  estimatedDuration: Int!
  thumbnailUrl: String
  objectives: [String!]
  prerequisites: [String!]
  sections: [Section!]
  assessments: [Assessment!]
  resources: [Resource!]
  createdAt: String!
  updatedAt: String!
}

type Section {
  id: ID!
  title: String!
  order: Int!
  content: [Content!]!
}

type Content {
  id: ID!
  type: String!
  title: String!
  url: String
  content: String
  duration: Int
}

type Resource {
  id: ID!
  title: String!
  type: String!
  url: String!
}

type ModuleConnection {
  data: [Module!]!
  pagination: Pagination!
}

# Type definitions for Assessments
type Assessment {
  id: ID!
  title: String!
  description: String!
  subject: String!
  ageGroup: String!
  type: String!
  questionCount: Int!
  estimatedDuration: Int!
  passingScore: Int!
  moduleId: ID
  instructions: String
  questions: [Question!]
  createdAt: String!
  updatedAt: String!
}

type Question {
  id: ID!
  type: String!
  text: String!
  options: [String!]
  correctOption: Int
  correctAnswer: String
  points: Int!
}

type Submission {
  id: ID!
  assessmentId: ID!
  userId: ID!
  score: Int!
  totalPoints: Int!
  percentage: Float!
  passed: Boolean!
  timeSpent: Int!
  submittedAt: String!
  gradedAt: String
  feedback: String
  questionResults: [QuestionResult!]!
}

type QuestionResult {
  questionId: ID!
  correct: Boolean!
  points: Int!
  feedback: String
}

type AssessmentConnection {
  data: [Assessment!]!
  pagination: Pagination!
}

type SubmissionConnection {
  data: [Submission!]!
  pagination: Pagination!
}

# Type definitions for AI Avatar
type AvatarGeneration {
  id: ID!
  status: String!
  script: String!
  avatarStyle: String!
  ageGroup: String!
  voice: String!
  duration: String!
  background: String!
  videoUrl: String
  thumbnailUrl: String
  estimatedCompletionTime: String
  createdAt: String!
  completedAt: String
  updatedAt: String!
}

# Type definitions for Analytics
type UserProgress {
  userId: ID!
  overallProgress: ProgressStats!
  subjectProgress: [SubjectProgress!]!
  recentActivity: [Activity!]!
}

type ClassProgress {
  classId: ID!
  className: String!
  overallProgress: ClassProgressStats!
  subjectProgress: [SubjectProgress!]!
  studentProgress: [StudentProgress!]!
}

type ProgressStats {
  modulesStarted: Int!
  modulesCompleted: Int!
  assessmentsTaken: Int!
  assessmentsPassed: Int!
  totalTimeSpent: Int!
  averageScore: Float!
}

type ClassProgressStats {
  studentCount: Int!
  modulesStarted: Int!
  modulesCompleted: Int!
  assessmentsTaken: Int!
  assessmentsPassed: Int!
  averageScore: Float!
}

type SubjectProgress {
  subject: String!
  modulesStarted: Int!
  modulesCompleted: Int!
  assessmentsTaken: Int!
  assessmentsPassed: Int!
  totalTimeSpent: Int
  averageScore: Float!
}

type StudentProgress {
  userId: ID!
  firstName: String!
  lastName: String!
  modulesStarted: Int!
  modulesCompleted: Int!
  assessmentsTaken: Int!
  assessmentsPassed: Int!
  averageScore: Float!
}

type Activity {
  type: String!
  moduleId: ID
  moduleTitle: String
  assessmentId: ID
  assessmentTitle: String
  score: Int
  passed: Boolean
  submittedAt: String!
}

# Common types
type Pagination {
  total: Int!
  page: Int!
  limit: Int!
  pages: Int!
}

# Input types
input UpdateUserProfileInput {
  firstName: String
  lastName: String
  preferences: UserPreferencesInput
}

input UserPreferencesInput {
  theme: String
  notifications: Boolean
  ageGroup: String
}

input CreateModuleInput {
  title: String!
  description: String!
  subject: String!
  ageGroup: String!
  level: String!
  estimatedDuration: Int!
  objectives: [String!]
  prerequisites: [String!]
}

input UpdateModuleInput {
  title: String
  description: String
  subject: String
  ageGroup: String
  level: String
  estimatedDuration: Int
  objectives: [String!]
  prerequisites: [String!]
}

input CreateAssessmentInput {
  title: String!
  description: String!
  subject: String!
  ageGroup: String!
  type: String!
  questionCount: Int!
  estimatedDuration: Int!
  passingScore: Int!
  moduleId: ID
  instructions: String
  questions: [QuestionInput!]!
}

input UpdateAssessmentInput {
  title: String
  description: String
  subject: String
  ageGroup: String
  type: String
  questionCount: Int
  estimatedDuration: Int
  passingScore: Int
  moduleId: ID
  instructions: String
  questions: [QuestionInput!]
}

input QuestionInput {
  type: String!
  text: String!
  options: [String!]
  correctOption: Int
  correctAnswer: String
  points: Int!
}

input SubmitAssessmentInput {
  answers: [AnswerInput!]!
  timeSpent: Int!
}

input AnswerInput {
  questionId: ID!
  selectedOption: Int
  textInput: String
}

input GenerateAvatarInput {
  script: String!
  avatarStyle: String!
  ageGroup: String!
  voice: String!
  duration: String!
  background: String!
}
```

### Example Queries

#### Get User Profile and Progress

```graphql
query {
  me {
    id
    firstName
    lastName
    role
    organisation
    preferences {
      theme
      notifications
      ageGroup
    }
  }
  userProgress {
    overallProgress {
      modulesStarted
      modulesCompleted
      assessmentsTaken
      assessmentsPassed
      averageScore
    }
    subjectProgress {
      subject
      modulesCompleted
      averageScore
    }
    recentActivity(limit: 5) {
      type
      moduleTitle
      assessmentTitle
      score
      submittedAt
    }
  }
}
```

#### Get Module with Assessments

```graphql
query GetModule($id: ID!) {
  module(id: $id) {
    id
    title
    description
    subject
    ageGroup
    level
    estimatedDuration
    sections {
      id
      title
      order
      content {
        id
        type
        title
        url
        content
        duration
      }
    }
    assessments {
      id
      title
      type
      questionCount
      estimatedDuration
    }
  }
}
```

### Example Mutations

#### Update User Profile

```graphql
mutation UpdateProfile($input: UpdateUserProfileInput!) {
  updateUserProfile(input: $input) {
    id
    firstName
    lastName
    preferences {
      theme
      notifications
      ageGroup
    }
    updatedAt
  }
}
```

Variables:
```json
{
  "input": {
    "firstName": "Jonathan",
    "lastName": "Smith",
    "preferences": {
      "theme": "dark",
      "notifications": false
    }
  }
}
```

#### Submit Assessment

```graphql
mutation SubmitAssessment($id: ID!, $input: SubmitAssessmentInput!) {
  submitAssessment(id: $id, input: $input) {
    id
    score
    totalPoints
    percentage
    passed
    feedback
    questionResults {
      questionId
      correct
      points
      feedback
    }
  }
}
```

Variables:
```json
{
  "id": "assessment_123456",
  "input": {
    "answers": [
      {
        "questionId": "question_101",
        "selectedOption": 1
      },
      {
        "questionId": "question_102",
        "textInput": "5"
      }
    ],
    "timeSpent": 1800
  }
}
```

## Error Handling

### REST API Errors

REST API errors follow a consistent format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  }
}
```

Common error codes:
- `AUTHENTICATION_ERROR`: Authentication failed
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `VALIDATION_ERROR`: Invalid input data
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

### GraphQL API Errors

GraphQL API errors follow the GraphQL specification:

```json
{
  "errors": [
    {
      "message": "Invalid input data",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "updateUserProfile"
      ],
      "extensions": {
        "code": "VALIDATION_ERROR",
        "details": [
          {
            "field": "email",
            "message": "Must be a valid email address"
          }
        ]
      }
    }
  ],
  "data": null
}
```

## Webhooks

The platform supports webhooks for real-time event notifications:

### Available Events

- `user.created`: New user registration
- `user.updated`: User profile update
- `module.completed`: Module completion
- `assessment.submitted`: Assessment submission
- `avatar.generated`: AI avatar video generation completed

### Webhook Configuration

Webhooks can be configured in the platform settings (admin only):

```
POST /api/v1/webhooks
```

**Request Body Example:**
```json
{
  "url": "https://example.com/webhook",
  "events": ["assessment.submitted", "module.completed"],
  "secret": "your_webhook_secret"
}
```

### Webhook Payload

Webhook payloads include event details and a signature for verification:

```json
{
  "event": "assessment.submitted",
  "timestamp": "2025-05-19T15:30:00Z",
  "data": {
    "submissionId": "submission_345678",
    "assessmentId": "assessment_123456",
    "userId": "user_123456",
    "score": 85,
    "passed": true
  }
}
```

Headers:
```
X-EdPsych-Event: assessment.submitted
X-EdPsych-Signature: sha256=...
```

## API Clients

### JavaScript/TypeScript Client

```typescript
import { EdPsychClient } from '@edpsych/api-client';

// Initialize client
const client = new EdPsychClient({
  apiUrl: 'https://api.edpsychconnect.com',
  token: 'your_jwt_token'
});

// REST API example
async function getUserModules() {
  try {
    const modules = await client.learning.getModules({
      subject: 'Mathematics',
      ageGroup: 'secondary'
    });
    console.log(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
  }
}

// GraphQL API example
async function getUserProgressGraphQL() {
  try {
    const { data } = await client.graphql(`
      query {
        userProgress {
          overallProgress {
            modulesCompleted
            averageScore
          }
        }
      }
    `);
    console.log(data.userProgress);
  } catch (error) {
    console.error('Error fetching progress:', error);
  }
}
```

### Python Client

```python
from edpsych_client import EdPsychClient

# Initialize client
client = EdPsychClient(
    api_url='https://api.edpsychconnect.com',
    token='your_jwt_token'
)

# REST API example
def get_user_modules():
    try:
        modules = client.learning.get_modules(
            subject='Mathematics',
            age_group='secondary'
        )
        print(modules)
    except Exception as e:
        print(f"Error fetching modules: {e}")

# GraphQL API example
def get_user_progress_graphql():
    try:
        data = client.graphql("""
            query {
                userProgress {
                    overallProgress {
                        modulesCompleted
                        averageScore
                    }
                }
            }
        """)
        print(data['userProgress'])
    except Exception as e:
        print(f"Error fetching progress: {e}")
```

## Rate Limiting

To ensure platform stability and fair usage, API requests are subject to rate limiting:

- 100 requests per minute per authenticated user
- 10 requests per minute for unauthenticated endpoints

Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1621430400
```

When a rate limit is exceeded, the API returns a 429 Too Many Requests response:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Try again in 60 seconds.",
    "details": {
      "retryAfter": 60
    }
  }
}
```

## Conclusion

This API documentation provides a comprehensive reference for integrating with the EdPsych-AI-Education-Platform. The platform offers both RESTful and GraphQL APIs for accessing and manipulating data, with a focus on security, performance, and developer experience.

For additional support or questions about the API, please contact the platform administrators or refer to the developer community forums.
