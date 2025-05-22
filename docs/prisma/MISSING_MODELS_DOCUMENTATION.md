# Missing Prisma Models Documentation

## Overview

This document provides a comprehensive list of all Prisma models that are referenced in the codebase but are missing from the Prisma schema. These missing models are causing build failures in Vercel deployments.

## Missing Portfolio Models

The following portfolio-related models are referenced in the code but missing from the schema:

1. `portfolioProfile`
2. `portfolioQualification`
3. `portfolioAchievement`
4. `portfolioEvidence`
5. `portfolioEvidenceAchievement`
6. `portfolioReflection`
7. `portfolioReflectionEvidence`

## Implementation Plan

### 1. Add Missing Models to Schema

We will add all missing models to the Prisma schema with appropriate fields and relationships based on how they're used in the code.

### 2. Create Migration

After adding the models to the schema, we'll create a new migration:

```bash
npx prisma migrate dev --name add_missing_models
```

### 3. Update Code References

Ensure all code references use camelCase when accessing Prisma models, as per the project's documentation in `prisma-model-case-fix.md`.

### 4. Test Locally

Before deploying, we'll test the changes locally to ensure they resolve the build errors.

### 5. Commit and Push

Once verified, we'll commit and push the changes to GitHub, which will trigger a new Vercel build.

## Schema Definitions for Missing Models

Below are the proposed schema definitions for the missing portfolio models:

```prisma
// Portfolio Models
model PortfolioProfile {
  id                String   @id @default(cuid())
  userId            String   @unique
  name              String
  title             String
  school            String?
  yearsExperience   Int?
  email             String?
  phone             String?
  biography         String?  @db.Text
  teachingPhilosophy String? @db.Text
  specialisations   String[]
  avatarUrl         String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model PortfolioQualification {
  id                String   @id @default(cuid())
  userId            String
  title             String
  institution       String
  year              String
  verified          Boolean  @default(false)
  certificateUrl    String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime? @updatedAt
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model PortfolioAchievement {
  id                String   @id @default(cuid())
  userId            String
  title             String
  description       String   @db.Text
  date              String
  type              String
  evidence          String[]
  visibility        String   @default("public")
  createdAt         DateTime @default(now())
  updatedAt         DateTime? @updatedAt
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  evidenceItems     PortfolioEvidenceAchievement[]
}

model PortfolioEvidence {
  id                String   @id @default(cuid())
  userId            String
  title             String
  description       String   @db.Text
  type              String
  date              String
  fileUrl           String
  fileType          String
  tags              String[]
  visibility        String   @default("public")
  createdAt         DateTime @default(now())
  updatedAt         DateTime? @updatedAt
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievements      PortfolioEvidenceAchievement[]
  reflections       PortfolioReflectionEvidence[]
}

model PortfolioEvidenceAchievement {
  id                String   @id @default(cuid())
  evidenceId        String
  achievementId     String
  evidence          PortfolioEvidence    @relation(fields: [evidenceId], references: [id], onDelete: Cascade)
  achievement       PortfolioAchievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)

  @@unique([evidenceId, achievementId])
}

model PortfolioReflection {
  id                String   @id @default(cuid())
  userId            String
  title             String
  content           String   @db.Text
  date              String
  tags              String[]
  visibility        String   @default("public")
  createdAt         DateTime @default(now())
  updatedAt         DateTime? @updatedAt
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  evidenceItems     PortfolioReflectionEvidence[]
}

model PortfolioReflectionEvidence {
  id                String   @id @default(cuid())
  reflectionId      String
  evidenceId        String
  reflection        PortfolioReflection @relation(fields: [reflectionId], references: [id], onDelete: Cascade)
  evidence          PortfolioEvidence   @relation(fields: [evidenceId], references: [id], onDelete: Cascade)

  @@unique([reflectionId, evidenceId])
}
```

## Guidelines for Developers

1. **Model Naming Convention**: 
   - Define models in PascalCase in the schema (e.g., `model PortfolioProfile {}`)
   - Access models via the Prisma client in camelCase (e.g., `prisma.portfolioProfile`)

2. **Adding New Models**:
   - Always add new models to the schema before referencing them in code
   - Create migrations for schema changes
   - Document new models in appropriate documentation files

3. **Fixing Case Mismatches**:
   - If you encounter TypeScript errors about missing properties on PrismaClient, check the case
   - Use the automated fix script: `node scripts/fix-prisma-model-case.js`

## Next Steps

After implementing these changes, we'll need to:

1. Monitor the Vercel build to ensure it completes successfully
2. Test the functionality of the portfolio features to ensure they work as expected
3. Consider adding automated tests to prevent similar issues in the future
