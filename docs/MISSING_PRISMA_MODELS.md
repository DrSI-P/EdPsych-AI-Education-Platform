# Missing Prisma Models

## Overview

This document lists all models that are referenced in the codebase but not defined in the Prisma schema. These models need to be added to the schema to resolve TypeScript errors and ensure proper functionality of the application.

The models are organized by category to make it easier to understand their purpose and relationships.

## Immediate Issues

These models are causing build failures and should be addressed first:

1. **curriculumPlanCollaborator** - Used in `src/app/api/curriculum/collaboration/route.ts`
   - Note: We've added `CurriculumPlanCollaborator` to the schema, but the code is using lowercase `curriculumPlanCollaborator`. This case mismatch needs to be resolved.

## Assessment Models

```prisma
model AssessmentResult {
  id           String    @id @default(cuid())
  assessmentId String
  studentId    String
  score        Int
  feedback     String?   @db.Text
  completedAt  DateTime
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  assessment   Assessment @relation(fields: [assessmentId], references: [id])
  student      User      @relation(fields: [studentId], references: [id])
}
## Special Needs Models

### SEMH Assessment

```prisma
model SEMHAssessment {
  id          String    @id @default(cuid())
  studentId   String
  assessorId  String
  date        DateTime
  results     Json
  notes       String?   @db.Text
  followUpDate DateTime?
  status      String    @default("completed")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  student     User      @relation("StudentSEMHAssessments", fields: [studentId], references: [id])
  assessor    User      @relation("AssessorSEMHAssessments", fields: [assessorId], references: [id])
}
```

### Biofeedback Session

```prisma
model BiofeedbackSession {
  id            String    @id @default(cuid())
  studentId     String
  facilitatorId String
  date          DateTime
  duration      Int       // in minutes
  metrics       Json
  notes         String?   @db.Text
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  student       User      @relation("StudentBiofeedbackSessions", fields: [studentId], references: [id])
  facilitator   User      @relation("FacilitatorBiofeedbackSessions", fields: [facilitatorId], references: [id])
}
```

### Emotional Pattern Record

```prisma
model EmotionalPatternRecord {
  id        String    @id @default(cuid())
  studentId String
  date      DateTime
  patterns  Json
  triggers  String[]
  strategies String[]
  notes     String?   @db.Text
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  student   User      @relation("StudentEmotionalPatternRecords", fields: [studentId], references: [id])
}
```
### Behavior Tracking

```prisma
model BehaviorDefinition {
  id          String    @id @default(cuid())
  userId      String
  name        String
  description String    @db.Text
  category    String
  pointValue  Int       @default(1)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
  trackings   BehaviorTracking[]
}

model BehaviorTracking {
  id          String    @id @default(cuid())
  behaviorId  String
  userId      String
  studentId   String?
  date        DateTime
  notes       String?   @db.Text
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  behavior    BehaviorDefinition @relation(fields: [behaviorId], references: [id])
  user        User      @relation("UserBehaviorTrackings", fields: [userId], references: [id])
  student     User?     @relation("StudentBehaviorTrackings", fields: [studentId], references: [id])
}

model BehaviorGoal {
  id          String    @id @default(cuid())
  userId      String
  behaviorId  String
  title       String
  description String    @db.Text
  targetValue Int
  currentValue Int      @default(0)
  isCompleted Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
  behavior    BehaviorDefinition @relation(fields: [behaviorId], references: [id])
}

model BehaviorReward {
  id          String    @id @default(cuid())
  userId      String
  name        String
  description String    @db.Text
  pointCost   Int
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
}

model BehaviorTrackingSettings {
  id          String    @id @default(cuid())
  userId      String    @unique
  enablePointSystem Boolean @default(true)
  enableRewards Boolean @default(true)
  enableGoals  Boolean  @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
}

model BehaviorTrackingLog {
  id          String    @id @default(cuid())
  userId      String
  action      String
  details     Json
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
}

model RewardRedemption {
  id          String    @id @default(cuid())
  userId      String
  rewardId    String
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
  reward      BehaviorReward @relation(fields: [rewardId], references: [id])
}
```
### Social Skills

```prisma
model SocialSkillsSettings {
  id          String    @id @default(cuid())
  userId      String    @unique
  enableStories Boolean @default(true)
  enableActivities Boolean @default(true)
  enableGoals  Boolean  @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
}

model SocialSkillsLog {
  id          String    @id @default(cuid())
  userId      String
  action      String
  details     Json
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
}

model SocialStory {
  id          String    @id @default(cuid())
  userId      String
  title       String
  content     String    @db.Text
  scenario    String
  skills      String[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
}

model SocialSkillsActivity {
  id          String    @id @default(cuid())
  userId      String
  title       String
  description String    @db.Text
  type        String
  skills      String[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
}

model SocialSkillsGoal {
  id          String    @id @default(cuid())
  userId      String
  title       String
  description String    @db.Text
  skills      String[]
  isCompleted Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
}

model PeerInteraction {
  id          String    @id @default(cuid())
  userId      String
  date        DateTime
  peers       String[]
  context     String
  notes       String    @db.Text
  skills      String[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
}
```
### Emotional Regulation

```prisma
model EmotionalRegulationSettings {
  id          String    @id @default(cuid())
  userId      String    @unique
  enableEmotions Boolean @default(true)
  enableJournal Boolean @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
}

model EmotionalRegulationLog {
  id          String    @id @default(cuid())
  userId      String
  action      String
  details     Json
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
}

model EmotionRecord {
  id          String    @id @default(cuid())
  userId      String
  emotion     String
  intensity   Int       // 1-10
  triggers    String[]
  strategies  String[]
  date        DateTime
  notes       String?   @db.Text
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
}

model EmotionJournal {
  id          String    @id @default(cuid())
  userId      String
  title       String
  content     String    @db.Text
  emotions    String[]
  date        DateTime
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
}
```
### Sensory Regulation

```prisma
model SensoryRegulationSettings {
  id          String    @id @default(cuid())
  userId      String    @unique
  visualSensitivity Int @default(5) // 1-10
  auditorySensitivity Int @default(5) // 1-10
  tactileSensitivity Int @default(5) // 1-10
  vestibularSensitivity Int @default(5) // 1-10
  proprioceptiveSensitivity Int @default(5) // 1-10
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
}

model SensoryRegulationLog {
  id          String    @id @default(cuid())
  userId      String
  action      String
  details     Json
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
}

model SensoryActivity {
  id          String    @id @default(cuid())
  userId      String
  title       String
  description String    @db.Text
  type        String    // visual, auditory, tactile, vestibular, proprioceptive
  duration    Int       // in minutes
  intensity   Int       // 1-10
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
  dietItems   SensoryDietSchedule[]
}

model SensoryDiet {
  id          String    @id @default(cuid())
  userId      String
  title       String
  description String    @db.Text
  isActive    Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
  schedule    SensoryDietSchedule[]
}

model SensoryDietSchedule {
  id          String    @id @default(cuid())
  dietId      String
  activityId  String
  time        String    // e.g., "08:00", "14:30"
  dayOfWeek   String[]  // e.g., ["Monday", "Wednesday", "Friday"]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  diet        SensoryDiet @relation(fields: [dietId], references: [id], onDelete: Cascade)
  activity    SensoryActivity @relation(fields: [activityId], references: [id])
}
```
### Progress Monitoring

```prisma
model ProgressMonitoring {
  id          String    @id @default(cuid())
  userId      String    @unique
  frequency   String    @default("weekly") // daily, weekly, monthly
  enableGoals Boolean   @default(true)
  enableCharts Boolean  @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
}

model MonitoringLog {
  id          String    @id @default(cuid())
  userId      String
  action      String
  details     Json
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
}

model MonitoringGoal {
  id          String    @id @default(cuid())
  userId      String
  title       String
  description String    @db.Text
  targetValue Float
  currentValue Float    @default(0)
  unit        String
  frequency   String    @default("weekly") // daily, weekly, monthly
  startDate   DateTime
  endDate     DateTime?
  isCompleted Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
  dataPoints  DataPoint[]
}

model DataPoint {
  id          String    @id @default(cuid())
  goalId      String
  value       Float
  date        DateTime
  notes       String?   @db.Text
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  goal        MonitoringGoal @relation(fields: [goalId], references: [id], onDelete: Cascade)
}
```
### Personalized Interventions

```prisma
model PersonalizedInterventions {
  id          String    @id @default(cuid())
  userId      String    @unique
  enableBehavioral Boolean @default(true)
  enableCognitive Boolean @default(true)
  enableSocial Boolean @default(true)
  enableEmotional Boolean @default(true)
  settings    Json
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
}

model InterventionLog {
  id          String    @id @default(cuid())
  userId      String
  action      String
  details     Json
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
}
```

### Intervention Analytics

```prisma
model InterventionAnalyticsSettings {
  id          String    @id @default(cuid())
  userId      String    @unique
  enableBehavioral Boolean @default(true)
  enableAcademic Boolean @default(true)
  enableSocial Boolean @default(true)
  enableEmotional Boolean @default(true)
  settings    Json
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
}

model AnalyticsLog {
  id          String    @id @default(cuid())
  userId      String
  action      String
  details     Json
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
}
```
### Teacher Alerts

```prisma
model TeacherAlert {
  id          String    @id @default(cuid())
  userId      String
  studentId   String
  type        String    // behavior, academic, emotional, social
  severity    String    // low, medium, high
  description String    @db.Text
  status      String    @default("active") // active, resolved
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation("TeacherAlerts", fields: [userId], references: [id])
  student     User      @relation("StudentAlerts", fields: [studentId], references: [id])
}

model TeacherAlertSettings {
  id          String    @id @default(cuid())
  userId      String    @unique
  enableBehavioral Boolean @default(true)
  enableAcademic Boolean @default(true)
  enableSocial Boolean @default(true)
  enableEmotional Boolean @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
}

model ABCCRecord {
  id          String    @id @default(cuid())
  userId      String
  studentId   String
  antecedent  String    @db.Text
  behavior    String    @db.Text
  consequence String    @db.Text
  context     String    @db.Text
  date        DateTime
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation("TeacherABCCRecords", fields: [userId], references: [id])
  student     User      @relation("StudentABCCRecords", fields: [studentId], references: [id])
}

model ActivityLog {
  id          String    @id @default(cuid())
  userId      String
  action      String
  details     Json
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
}
```
### Digital Expression

```prisma
model DigitalJournalEntry {
  id          String    @id @default(cuid())
  userId      String
  title       String
  content     String    @db.Text
  mood        String?
  tags        String[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
  responses   DigitalJournalResponse[]
}

model DigitalJournalResponse {
  id          String    @id @default(cuid())
  entryId     String
  userId      String
  content     String    @db.Text
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  entry       DigitalJournalEntry @relation(fields: [entryId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id])
}

model DigitalArtwork {
  id          String    @id @default(cuid())
  userId      String
  title       String
  description String?   @db.Text
  imageUrl    String
  medium      String
  tags        String[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
  responses   DigitalArtworkResponse[]
}

model DigitalArtworkResponse {
  id          String    @id @default(cuid())
  artworkId   String
  userId      String
  content     String    @db.Text
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  artwork     DigitalArtwork @relation(fields: [artworkId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id])
}

model DigitalMediaProject {
  id          String    @id @default(cuid())
  userId      String
  title       String
  description String?   @db.Text
  mediaUrl    String
  mediaType   String    // video, audio, presentation
  tags        String[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
  responses   DigitalMediaResponse[]
}

model DigitalMediaResponse {
  id          String    @id @default(cuid())
  projectId   String
  userId      String
  content     String    @db.Text
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  project     DigitalMediaProject @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id])
}

model PeerSupportGroup {
  id          String    @id @default(cuid())
  name        String
  description String    @db.Text
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  members     PeerSupportGroupMember[]
  messages    PeerSupportGroupMessage[]
}

model PeerSupportGroupMember {
  id          String    @id @default(cuid())
  groupId     String
  userId      String
  role        String    @default("member") // member, moderator
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  group       PeerSupportGroup @relation(fields: [groupId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id])
}

model PeerSupportGroupMessage {
  id          String    @id @default(cuid())
  groupId     String
  userId      String
  content     String    @db.Text
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  group       PeerSupportGroup @relation(fields: [groupId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id])
  responses   PeerSupportGroupMessageResponse[]
}

model PeerSupportGroupMessageResponse {
  id          String    @id @default(cuid())
  messageId   String
  userId      String
  content     String    @db.Text
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  message     PeerSupportGroupMessage @relation(fields: [messageId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id])
}
```
### Learning Differences

```prisma
model LearningDifferenceProfile {
  id          String    @id @default(cuid())
  userId      String    @unique
  dyslexia    Int?      // 0-100 scale
  dysgraphia  Int?      // 0-100 scale
  dyscalculia Int?      // 0-100 scale
  adhd        Int?      // 0-100 scale
  asd         Int?      // 0-100 scale
  settings    Json?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
}
```

### IEP/504 Plan

```prisma
model IEP504Plan {
  id          String    @id @default(cuid())
  userId      String
  studentId   String
  type        String    // IEP, 504
  startDate   DateTime
  endDate     DateTime?
  status      String    @default("active") // draft, active, archived
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation("CreatedPlans", fields: [userId], references: [id])
  student     User      @relation("StudentPlans", fields: [studentId], references: [id])
  goals       IEP504Goal[]
  accommodations IEP504Accommodation[]
  services    IEP504Service[]
  teamMembers IEP504TeamMember[]
}

model IEP504Goal {
  id          String    @id @default(cuid())
  planId      String
  description String    @db.Text
  area        String    // academic, behavioral, social, etc.
  progress    String    @default("not-started") // not-started, in-progress, achieved
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  plan        IEP504Plan @relation(fields: [planId], references: [id], onDelete: Cascade)
}

model IEP504Accommodation {
  id          String    @id @default(cuid())
  planId      String
  description String    @db.Text
  area        String    // academic, behavioral, environmental, etc.
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  plan        IEP504Plan @relation(fields: [planId], references: [id], onDelete: Cascade)
}

model IEP504Service {
  id          String    @id @default(cuid())
  planId      String
  description String    @db.Text
  provider    String
  frequency   String
  duration    String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  plan        IEP504Plan @relation(fields: [planId], references: [id], onDelete: Cascade)
}

model IEP504TeamMember {
  id          String    @id @default(cuid())
  planId      String
  name        String
  role        String
  email       String?
  phone       String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  plan        IEP504Plan @relation(fields: [planId], references: [id], onDelete: Cascade)
}

model IEP504PlanLog {
  id          String    @id @default(cuid())
  userId      String
  planId      String
  action      String
  details     Json
  createdAt   DateTime  @default(now())
  user        User      @relation(fields: [userId], references: [id])
  plan        IEP504Plan @relation(fields: [planId], references: [id], onDelete: Cascade)
}
```

### Transition Planning

```prisma
model TransitionPlan {
  id          String    @id @default(cuid())
  userId      String
  studentId   String
  title       String
  description String    @db.Text
  startDate   DateTime
  endDate     DateTime?
  status      String    @default("active") // draft, active, completed
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation("CreatedTransitionPlans", fields: [userId], references: [id])
  student     User      @relation("StudentTransitionPlans", fields: [studentId], references: [id])
}
```
### Parent-Teacher Communication

```prisma
model CommunicationSettings {
  id                String    @id @default(cuid())
  userId            String    @unique
  preferredMethod   String    @default("email") // email, app, sms
  notificationFrequency String @default("daily") // immediate, daily, weekly
  enableMessageNotifications Boolean @default(true)
  enableMeetingNotifications Boolean @default(true)
  enableReportNotifications Boolean @default(true)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  user              User      @relation(fields: [userId], references: [id])
}

model CommunicationMessage {
  id                String    @id @default(cuid())
  senderId          String
  recipientId       String
  subject           String
  content           String    @db.Text
  isRead            Boolean   @default(false)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  sender            User      @relation("SentCommunicationMessages", fields: [senderId], references: [id])
  recipient         User      @relation("ReceivedCommunicationMessages", fields: [recipientId], references: [id])
}

model CommunicationMeeting {
  id                String    @id @default(cuid())
  organizerId       String
  title             String
  description       String    @db.Text
  date              DateTime
  duration          Int       // in minutes
  location          String?
  isVirtual         Boolean   @default(false)
  meetingLink       String?
  participantIds    String[]
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  organizer         User      @relation("OrganizedMeetings", fields: [organizerId], references: [id])
}

model CommunicationReportRequest {
  id                String    @id @default(cuid())
  requesterId       String
  studentId         String
  type              String    // progress, behavior, attendance, etc.
  status            String    @default("pending") // pending, completed
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  requester         User      @relation("RequestedReports", fields: [requesterId], references: [id])
  student           User      @relation("StudentReports", fields: [studentId], references: [id])
}

model CommunicationLog {
  id                String    @id @default(cuid())
  userId            String
  action            String
  details           Json
  createdAt         DateTime  @default(now())
  user              User      @relation(fields: [userId], references: [id])
}
```

### Emotional Vocabulary

```prisma
model EmotionalVocabularyPreferences {
  id                String    @id @default(cuid())
  userId            String    @unique
  ageGroup          String    @default("elementary") // preschool, elementary, middle, high
  complexity        String    @default("basic") // basic, intermediate, advanced
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  user              User      @relation(fields: [userId], references: [id])
}

model EmotionalVocabularyProgress {
  id                String    @id @default(cuid())
  userId            String
  emotionId         String
  familiarity       Int       // 1-5 scale
  usage             Int       // 1-5 scale
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  user              User      @relation(fields: [userId], references: [id])
  emotion           EmotionalVocabularyTerm @relation(fields: [emotionId], references: [id])
}

model EmotionalVocabularyTerm {
  id                String    @id @default(cuid())
  term              String
  definition        String    @db.Text
  category          String    // primary, secondary, tertiary
  complexity        String    // basic, intermediate, advanced
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  progress          EmotionalVocabularyProgress[]
}

model EmotionalVocabularyActivity {
  id                String    @id @default(cuid())
  title             String
  description       String    @db.Text
  ageGroup          String    // preschool, elementary, middle, high
  complexity        String    // basic, intermediate, advanced
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```
## Implementation Plan

### Immediate Fix for CurriculumPlanCollaborator

To fix the immediate issue with the `curriculumPlanCollaborator` model, we have two options:

1. **Update the code to match the schema (recommended):**
   - Find all instances where `curriculumPlanCollaborator` is used in the code and update them to use `CurriculumPlanCollaborator` (with uppercase first letter)
   - This approach is preferred because it follows Prisma's naming conventions where model names start with uppercase letters

2. **Update the schema to match the code:**
   - Modify the schema to use `curriculumPlanCollaborator` instead of `CurriculumPlanCollaborator`
   - This is less ideal as it breaks Prisma's naming conventions

### Phased Implementation for Other Models

Given the large number of missing models, we should implement them in phases:

1. **Phase 1: Core Models**
   - Focus on models that are causing build failures or blocking critical functionality
   - Includes: CurriculumPlanCollaborator (case fix), AssessmentResult

2. **Phase 2: User-Facing Features**
   - Implement models needed for user-facing features
   - Includes: SEMHAssessment, BiofeedbackSession, EmotionalPatternRecord, BehaviorTracking models

3. **Phase 3: Administrative Features**
   - Implement models needed for administrative features
   - Includes: IEP504Plan and related models, TeacherAlert models

4. **Phase 4: Advanced Features**
   - Implement models for advanced features
   - Includes: Digital Expression models, Emotional Vocabulary models

### Best Practices for Schema Updates

1. **Create migrations incrementally:**
   - Don't add all models at once
   - Group related models in the same migration

2. **Test migrations locally:**
   - Before deploying, test migrations on a local database
   - Verify that the schema changes don't break existing functionality

3. **Update code references:**
   - Ensure all code references to the models are updated to match the schema
   - Pay attention to case sensitivity

4. **Document changes:**
   - Create documentation for each set of model additions
   - Include the purpose of each model and its relationships

## Conclusion

This document provides a comprehensive list of models that need to be added to the Prisma schema to resolve TypeScript errors and ensure proper functionality of the application. By following the implementation plan outlined above, we can systematically address these schema-code mismatches and improve the stability of the application.

The immediate issue with the `curriculumPlanCollaborator` model should be addressed first, followed by the phased implementation of the other missing models. This approach will minimize disruption to the application while ensuring that all necessary models are eventually added to the schema.