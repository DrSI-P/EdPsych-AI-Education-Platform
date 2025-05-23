# Mentorship and Portfolio Models Migration Guide

## Overview

This document provides a comprehensive guide for the migration process to add Mentorship and Portfolio models to the EdPsych-AI-Education-Platform. The migration includes new models for mentor matching, mentorship management, and portfolio tracking.

## Schema Changes

The migration adds the following models to the Prisma schema:

### Mentorship Models
- `MentorProfile`: Stores information about mentors, including their expertise and availability
- `MentorshipRequest`: Tracks requests from mentees to mentors
- `Mentorship`: Represents an active mentorship relationship between a mentor and mentee
- `MentorshipMeeting`: Records meetings between mentors and mentees
- `MentorshipResource`: Stores resources shared during mentorship
- `MentorshipFeedback`: Captures feedback from both mentors and mentees

### Portfolio Models
- `PortfolioProfile`: Main profile for a user's professional portfolio
- `PortfolioQualification`: Records qualifications and certifications
- `PortfolioAchievement`: Tracks professional achievements
- `PortfolioEvidence`: Stores evidence of professional development
- `PortfolioEvidenceAchievement`: Links evidence to achievements
- `PortfolioReflection`: Captures reflections on professional development
- `PortfolioReflectionEvidence`: Links reflections to evidence
- `Certificate`: Stores certificates earned through the platform

### User Model Updates
The User model has been updated with new relations to connect to these models:
- Mentorship relations: `mentorProfile`, `mentorRequests`, `menteeRequests`, etc.
- Portfolio relations: `portfolioProfile`, `certificates`, etc.

## Migration Process

### 1. Schema Preparation

Several scripts were created to prepare the schema for migration:

- **fix-schema-conflicts.js**: Resolves merge conflicts in the schema file
- **remove-duplicate-models.js**: Removes duplicate model definitions
- **fix-mentorship-model.js**: Adds the `@unique` attribute to the `requestId` field

To run these scripts in sequence:

```bash
node EdPsych-AI-Education-Platform/scripts/fix-schema-conflicts.js
node EdPsych-AI-Education-Platform/scripts/remove-duplicate-models.js
node EdPsych-AI-Education-Platform/scripts/fix-mentorship-model.js
```

### 2. Generate Prisma Client

After fixing the schema, generate the Prisma client:

```bash
npx prisma generate --schema=EdPsych-AI-Education-Platform/prisma/schema.prisma
```

### 3. Apply Migration

Use the deploy-migration.js script to apply the migration to the database:

```bash
node EdPsych-AI-Education-Platform/scripts/deploy-migration.js
```

The script will:
1. Check if the migration is already applied
2. Ask for confirmation before proceeding
3. Try multiple approaches to apply the migration:
   - Using `prisma migrate resolve`
   - Using `prisma db execute`
   - Providing instructions for manual SQL execution if needed
4. Generate the Prisma client after successful migration

## Troubleshooting

### Schema Validation Errors

If you encounter schema validation errors:

1. Check for duplicate model definitions:
   ```bash
   node EdPsych-AI-Education-Platform/scripts/remove-duplicate-models.js
   ```

2. Verify that all referenced models are defined:
   ```bash
   node EdPsych-AI-Education-Platform/scripts/fix-schema-conflicts.js
   ```

3. Check for missing `@unique` attributes on relation fields:
   ```bash
   node EdPsych-AI-Education-Platform/scripts/fix-mentorship-model.js
   ```

### Migration Errors

If the migration fails to apply:

1. Check the database connection:
   ```bash
   npx prisma db pull
   ```

2. Try applying the migration manually:
   - Open the migration SQL file: `EdPsych-AI-Education-Platform/prisma/migrations/20250522_add_mentorship_and_portfolio_models/migration.sql`
   - Execute the SQL in your database management tool
   - Mark the migration as applied:
     ```bash
     npx prisma migrate resolve --applied 20250522_add_mentorship_and_portfolio_models
     ```

## Testing

After applying the migration, test the API routes:

- Mentor Matching: `/api/professional-development/mentor-matching`
- Portfolio: `/api/professional-development/portfolio`

## Conclusion

This migration adds comprehensive support for mentorship and portfolio features to the EdPsych-AI-Education-Platform. The new models enable users to engage in mentorship relationships and maintain professional development portfolios.

For detailed information about the schema fixes and migration process, refer to the [Schema Fix and Migration Report](./SCHEMA_FIX_AND_MIGRATION_REPORT.md).