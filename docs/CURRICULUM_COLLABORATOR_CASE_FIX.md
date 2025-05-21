# CurriculumPlanCollaborator Case Sensitivity Fix

## Issue

The Prisma schema defines a model called `CurriculumPlanCollaborator` (with uppercase first letter), but the code references it as `curriculumPlanCollaborator` (with lowercase first letter). This case sensitivity mismatch is causing TypeScript errors and build failures in the Vercel deployment.

Error message:
```
Failed to compile.
./src/app/api/curriculum/collaboration/route.ts:31:37
Type error: Property 'curriculumPlanCollaborator' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
```

## Solution

We've implemented a two-part solution:

1. **Documentation**: Created a comprehensive document (`MISSING_PRISMA_MODELS.md`) listing all models that are referenced in the codebase but not defined in the Prisma schema, including the `CurriculumPlanCollaborator` case sensitivity issue.

2. **Automated Fix**: Created a script (`fix-curriculum-collaborator-case.js`) that automatically finds and replaces all instances of `curriculumPlanCollaborator` with `CurriculumPlanCollaborator` in the codebase.

## Implementation Details

### The Fix Script

The script performs the following actions:

1. Recursively searches through all TypeScript and JavaScript files in the project
2. Finds all instances of `curriculumPlanCollaborator` (with lowercase first letter)
3. Replaces them with `CurriculumPlanCollaborator` (with uppercase first letter)
4. Outputs a summary of the changes made

### Why This Approach?

We chose to update the code to match the schema (rather than vice versa) for the following reasons:

1. It follows Prisma's naming conventions where model names start with uppercase letters
2. It's more consistent with the rest of the codebase
3. It's less disruptive than modifying the schema and creating new migrations

## How to Run the Fix

To apply the fix, run the following command:

```bash
node scripts/fix-curriculum-collaborator-case.js
```

After running the script, you should:

1. Review the changes made
2. Run the TypeScript compiler to verify that the errors are resolved
3. Test the application locally
4. Commit the changes and deploy to Vercel

## Prevention Measures

To prevent similar issues in the future:

1. Follow Prisma's naming conventions consistently (model names start with uppercase letters)
2. Use TypeScript's type checking during development to catch these issues early
3. Set up pre-commit hooks to run TypeScript checks
4. Implement CI/CD pipelines that run type checks before deployment

## Related Documentation

- [MISSING_PRISMA_MODELS.md](./MISSING_PRISMA_MODELS.md) - Comprehensive list of all missing models
- [PRISMA_MIGRATION_BEST_PRACTICES.md](./PRISMA_MIGRATION_BEST_PRACTICES.md) - Best practices for Prisma migrations