# Mentorship and Portfolio Models Migration Guide

## Overview

This document provides a comprehensive guide for adding the missing Mentorship and Portfolio models to the EdPsych-AI-Education-Platform database. These models are referenced in the codebase but were not defined in the Prisma schema, causing TypeScript errors and potential runtime issues.

## Models Added

### Mentorship Models

1. **MentorProfile**
   - Stores information about a user's mentorship profile
   - Contains fields for role, expertise, availability, and preferences

2. **MentorshipRequest**
   - Represents a request from a mentee to a mentor
   - Includes message, focus areas, goals, and status

3. **Mentorship**
   - Represents an active mentorship relationship
   - Links mentor and mentee with goals and status tracking

4. **MentorshipMeeting**
   - Tracks meetings between mentors and mentees
   - Includes date, duration, format, and notes

5. **MentorshipResource**
   - Resources shared within a mentorship
   - Can be links or uploaded files

6. **MentorshipFeedback**
   - Feedback provided by mentors and mentees
   - Includes ratings and comments

7. **CPDProfile**
   - Continuing Professional Development profile
   - Links to mentorship activities

### Portfolio Models

1. **PortfolioProfile**
   - Main profile for a user's professional portfolio
   - Contains biographical and professional information

2. **PortfolioQualification**
   - Educational and professional qualifications
   - Includes verification status

3. **PortfolioAchievement**
   - Professional achievements and accomplishments
   - Can be linked to evidence

4. **PortfolioEvidence**
   - Evidence supporting achievements
   - Can be documents, images, or other files

5. **PortfolioEvidenceAchievement**
   - Junction table linking evidence to achievements
   - Many-to-many relationship

6. **PortfolioReflection**
   - Professional reflections on experiences
   - Can be linked to evidence

7. **PortfolioReflectionEvidence**
   - Junction table linking reflections to evidence
   - Many-to-many relationship

8. **Certificate**
   - Professional certificates and credentials
   - Includes verification status

## Schema Changes

The migration adds the following to the Prisma schema:

1. **New Models**: All the models listed above with their fields and relationships
2. **User Model Updates**: New relations added to the User model to link to the new models
3. **Indexes**: Unique constraints and indexes for efficient querying
4. **Relations**: Foreign key relationships between models

## Migration Files

The following files have been created:

1. **Migration SQL**: `prisma/migrations/20250522_add_mentorship_and_portfolio_models/migration.sql`
   - Contains the SQL statements to create the tables and relationships

2. **Schema Additions**: `prisma/schema-additions.prisma`
   - Contains the Prisma schema definitions for the new models

3. **User Model Updates**: `prisma/user-model-updates.prisma`
   - Contains the updated User model with new relations

## Migration Scripts

We've created several scripts to help with the migration process:

1. **Fix Schema and Prepare Migration**: `scripts/fix-schema-and-prepare-migration.js`
   - Removes duplicate model definitions from the schema
   - Creates a backup of the original schema
   - Prepares the migration to be applied when database access is available

2. **Fix Mentorship Model**: `scripts/fix-mentorship-model.js`
   - Adds the `@unique` attribute to the `requestId` field in the Mentorship model
   - Ensures consistency between model definitions

3. **Check and Apply Schema Updates**: `scripts/check-and-apply-schema-updates.js`
   - Checks if models already exist in the database before attempting to add them
   - Creates a temporary migration file with only the missing models
   - Handles database connection issues gracefully

4. **Deploy Migration**: `scripts/deploy-migration.js`
   - Provides a robust way to apply the migration when database access is available
   - Offers multiple approaches to apply the migration
   - Includes interactive confirmation steps

## How to Apply the Migration

### Option 1: Using the Fix and Deploy Scripts (Recommended)

1. Run the fix schema script to remove duplicate model definitions:
   ```bash
   node scripts/fix-schema-and-prepare-migration.js
   ```

2. Run the fix mentorship model script to add the `@unique` attribute:
   ```bash
   node scripts/fix-mentorship-model.js
   ```

3. When database access is available, run the deploy migration script:
   ```bash
   node scripts/deploy-migration.js
   ```

4. Test the API routes to ensure they work correctly.

### Option 2: Using Prisma Migrate

1. Ensure you have access to the database
2. Run the following command:
   ```bash
   npx prisma migrate dev --name add_mentorship_and_portfolio_models
   ```

3. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

### Option 3: Manual SQL Execution

If you prefer to apply the migration manually:

1. Connect to the database using your preferred PostgreSQL client
2. Execute the SQL statements in `prisma/migrations/20250522_add_mentorship_and_portfolio_models/migration.sql`
3. Update the `_prisma_migrations` table to record the migration
4. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

## Verification

After applying the migration, verify that:

1. The new tables exist in the database
2. The Prisma client can access the new models
3. The API routes that use these models work correctly

## Troubleshooting

### Common Issues

1. **Duplicate Models**: If you see errors about models already existing, the models may have been added in a different migration. Use the `fix-schema-and-prepare-migration.js` script to remove duplicate definitions.

2. **Relation Errors**: If you see errors about relations, ensure that the referenced models exist and the field types match. The `fix-mentorship-model.js` script can help fix relation issues with the Mentorship model.

3. **Database Connection**: Ensure your DATABASE_URL environment variable is correctly set. If you can't connect to the database, use the `deploy-migration.js` script when database access is available.

4. **Schema Validation Errors**: If you see validation errors when generating the Prisma client, check for duplicate model definitions or inconsistent field attributes. The `fix-schema-and-prepare-migration.js` script can help resolve these issues.

## Next Steps

After applying this migration:

1. Update any TypeScript interfaces to match the new models
2. Test the affected API routes thoroughly
3. Update any frontend components that interact with these models
4. Commit and push the changes to GitHub

## Related Documentation

- [SCHEMA_FIX_AND_MIGRATION_REPORT.md](./SCHEMA_FIX_AND_MIGRATION_REPORT.md)
- [MISSING_PRISMA_MODELS.md](./MISSING_PRISMA_MODELS.md)
- [SCHEMA_CODE_MISMATCH_FIX.md](./SCHEMA_CODE_MISMATCH_FIX.md)
- [MENTOR_MATCHING.md](./MENTOR_MATCHING.md)
- [MENTOR_MATCHING_FEATURE.md](./MENTOR_MATCHING_FEATURE.md)