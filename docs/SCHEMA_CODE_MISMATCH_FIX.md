# Schema-Code Mismatch Fix

## Overview

This document provides a comprehensive overview of the schema-code mismatches in the EdPsych-AI-Education-Platform project and the approach to fixing them.

## Problem

The project has several mismatches between the Prisma schema and the code that references it:

1. **Missing Models**: Many models are referenced in the code but not defined in the Prisma schema
2. **Case Sensitivity Issues**: Some models are defined with different casing in the schema vs. the code
3. **Failed Migrations**: Some migrations have failed, leading to inconsistencies between the schema and the database

These issues are causing TypeScript errors and build failures in the Vercel deployment.

## Solution Approach

We've implemented a comprehensive solution that addresses these issues:

### 1. Documentation

- **[MISSING_PRISMA_MODELS.md](./MISSING_PRISMA_MODELS.md)**: A comprehensive list of all models referenced in the code but not defined in the schema
- **[CURRICULUM_COLLABORATOR_CASE_FIX.md](./CURRICULUM_COLLABORATOR_CASE_FIX.md)**: Documentation for the CurriculumPlanCollaborator case sensitivity fix
- **[PLUGIN_MODEL_FIX.md](./PLUGIN_MODEL_FIX.md)**: Documentation for the Plugin model fix
- **[CURRICULUM_COLLABORATION_FIX.md](./CURRICULUM_COLLABORATION_FIX.md)**: Documentation for the curriculum collaboration models fix
- **[PASSWORD_RESET_MODEL_FIX.md](./PASSWORD_RESET_MODEL_FIX.md)**: Documentation for the password reset model fix
- **[PRISMA_MIGRATION_BEST_PRACTICES.md](./PRISMA_MIGRATION_BEST_PRACTICES.md)**: Best practices for Prisma migrations

### 2. Fix Scripts

- **[fix-curriculum-collaborator-case.js](../scripts/fix-curriculum-collaborator-case.js)**: Fixes the case sensitivity issue with the CurriculumPlanCollaborator model
- **[fix-curriculum-collaboration-route.js](../scripts/fix-curriculum-collaboration-route.js)**: Targeted fix for the specific file causing the build failure
- **[fix-plugin-model-migration.js](../scripts/fix-plugin-model-migration.js)**: Fixes the Plugin model migration
- **[fix-curriculum-collaboration-migration.js](../scripts/fix-curriculum-collaboration-migration.js)**: Fixes the curriculum collaboration models migration
- **[fix-password-reset-migration.js](../scripts/fix-password-reset-migration.js)**: Fixes the password reset model migration
- **[apply-fix-migration.js](../scripts/apply-fix-migration.js)**: Applies all migrations
- **[apply-all-fixes.js](../scripts/apply-all-fixes.js)**: Master script that runs all fix scripts in the correct order

### 3. Implementation Plan

We've developed a phased implementation plan for adding the missing models:

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

## How to Apply the Fixes

To apply all the fixes at once, run:

```bash
node scripts/apply-all-fixes.js
```

This will run all the fix scripts in the correct order and provide feedback on the progress.

After running the fixes:

1. Run the TypeScript compiler to verify the fixes: `npx tsc --noEmit`
2. Test the application locally
3. Commit the changes and push to GitHub
4. Deploy to Vercel

## Prevention Measures

To prevent similar issues in the future:

1. Follow Prisma's naming conventions consistently (model names start with uppercase letters)
2. Use TypeScript's type checking during development to catch these issues early
3. Set up pre-commit hooks to run TypeScript checks
4. Implement CI/CD pipelines that run type checks before deployment
5. Regularly audit the codebase for references to models that don't exist in the schema
6. Document all models and their relationships in a central location
7. Create a process for adding new models that ensures schema-code consistency