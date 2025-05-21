# Curriculum Models Fix

This document provides instructions to fix the build issues related to missing Prisma models for curriculum standards and alignments.

## Issues Identified

1. The application code references two Prisma models that don't exist in the schema:
   - `curriculumStandard`
   - `curriculumAlignment`

2. Import path issues in some files:
   - Fixed import path in `src/app/api/curriculum/standards/[id]/route.ts` from `@/lib/db/prisma` to `@/lib/prisma`

## How to Fix

### 1. Add Missing Models to Prisma Schema

Add the models defined in `prisma/schema-update.prisma` to your main `prisma/schema.prisma` file. These models include:

- `CurriculumStandard`: For storing curriculum standards
- `CurriculumAlignment`: For aligning assessments with curriculum standards

### 2. Update Relations in Existing Models

After adding the new models, update the following existing models to include the new relations:

- `Assessment`: Add relation to `CurriculumAlignment`
- `User`: Add relation to `CurriculumAlignment`

### 3. Generate Prisma Client

After updating the schema, generate the Prisma client:

```bash
npx prisma generate
```

### 4. Create Migration

Create a migration to add the new models to the database:

```bash
npx prisma migrate dev --name add_curriculum_models
```

### 5. Deploy Migration

Deploy the migration to your production database:

```bash
npx prisma migrate deploy
```

## Alternative Approach

If you don't want to add these models to your schema, you can modify the application code to not use these models. The following files would need to be updated:

- `src/app/api/curriculum/standards/route.ts`
- `src/app/api/curriculum/standards/[id]/route.ts`
- `src/app/api/curriculum/standards/[id]/assessments/route.ts`

We've already commented out the code in `src/app/api/curriculum/standards/[id]/assessments/route.ts` that uses these models, but the other files would need similar changes.

## Next Steps

1. Choose whether to add the models to your schema or modify the application code
2. Apply the chosen fix
3. Commit and push the changes
4. Verify that the build succeeds