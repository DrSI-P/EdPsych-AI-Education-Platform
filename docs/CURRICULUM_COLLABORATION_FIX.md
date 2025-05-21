# Curriculum Collaboration Models Fix

## Issue

During the Vercel deployment process, we encountered a TypeScript error:

```
Type error: Property 'curriculumPlanCollaborator' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.
```

This error occurred in `src/app/api/curriculum/collaboration/route.ts` on line 31, where the code was trying to use `prisma.curriculumPlanCollaborator`, but this model wasn't defined in the Prisma schema.

## Root Cause

The application code was referencing several models related to curriculum collaboration that weren't defined in the Prisma schema:

1. `curriculumPlanCollaborator` - For managing collaborators on curriculum plans
2. `curriculumPlanComment` - For comments on curriculum plans
3. `curriculumPlanTask` - For tasks related to curriculum plans

This is a schema-code mismatch issue, similar to the previous issues we've fixed with the PasswordReset model and User password field.

## Solution

1. We added the missing models to the Prisma schema:

```prisma
// Curriculum Collaboration Models
model CurriculumPlanCollaborator {
  id        String   @id @default(cuid())
  role      String   @default("viewer") // viewer, editor
  planId    String
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  plan      CurriculumPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model CurriculumPlanComment {
  id        String   @id @default(cuid())
  content   String   @db.Text
  planId    String
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  plan      CurriculumPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model CurriculumPlanTask {
  id           String   @id @default(cuid())
  title        String
  description  String   @db.Text
  status       String   @default("pending") // pending, in_progress, completed
  dueDate      DateTime?
  planId       String
  creatorId    String
  assignedToId String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  plan         CurriculumPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  createdBy    User     @relation("TaskCreator", fields: [creatorId], references: [id], onDelete: Cascade)
  assignedTo   User?    @relation("TaskAssignee", fields: [assignedToId], references: [id])
}
```

2. We updated the CurriculumPlan model to include relations to these new models:

```prisma
model CurriculumPlan {
  // ... existing fields
  collaborators     CurriculumPlanCollaborator[]
  comments          CurriculumPlanComment[]
  tasks             CurriculumPlanTask[]
}
```

3. We updated the User model to include relations to these new models:

```prisma
model User {
  // ... existing fields
  curriculumCollaborations CurriculumPlanCollaborator[]
  curriculumComments       CurriculumPlanComment[]
  createdTasks             CurriculumPlanTask[]       @relation("TaskCreator")
  assignedTasks            CurriculumPlanTask[]       @relation("TaskAssignee")
}
```

4. We created a migration file for these changes:

```sql
-- CreateTable
CREATE TABLE "CurriculumPlanCollaborator" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "planId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumPlanCollaborator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumPlanComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumPlanComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurriculumPlanTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "dueDate" TIMESTAMP(3),
    "planId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurriculumPlanTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CurriculumPlanCollaborator" ADD CONSTRAINT "CurriculumPlanCollaborator_planId_fkey" FOREIGN KEY ("planId") REFERENCES "CurriculumPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumPlanCollaborator" ADD CONSTRAINT "CurriculumPlanCollaborator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumPlanComment" ADD CONSTRAINT "CurriculumPlanComment_planId_fkey" FOREIGN KEY ("planId") REFERENCES "CurriculumPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumPlanComment" ADD CONSTRAINT "CurriculumPlanComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumPlanTask" ADD CONSTRAINT "CurriculumPlanTask_planId_fkey" FOREIGN KEY ("planId") REFERENCES "CurriculumPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumPlanTask" ADD CONSTRAINT "CurriculumPlanTask_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurriculumPlanTask" ADD CONSTRAINT "CurriculumPlanTask_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

## Lessons Learned

1. **Schema-Code Consistency**: Always ensure that the Prisma schema accurately reflects all models used in the application code.

2. **Type Safety**: TypeScript's type checking can help identify mismatches between the schema and the code, but only if the types are properly defined and used.

3. **Comprehensive Testing**: Test all API routes and features before deployment to catch schema-code mismatches early.

4. **Documentation**: Document any changes to the schema, especially those related to new features or modules, to help future developers understand the system's design.

## Related Issues

This issue is similar to the other schema-code mismatch issues we've fixed:

- [PASSWORD_RESET_MODEL_FIX.md](./PASSWORD_RESET_MODEL_FIX.md) - Added missing PasswordReset model
- [USER_PASSWORD_FIELD_FIX.md](./USER_PASSWORD_FIELD_FIX.md) - Added missing password field to User model
- [VERIFICATION_TOKEN_FIX.md](./VERIFICATION_TOKEN_FIX.md) - Fixed incorrect usage of compound unique constraints
- [TYPESCRIPT_IMPLICIT_ANY_FIX.md](./TYPESCRIPT_IMPLICIT_ANY_FIX.md) - Fixed TypeScript type definitions

All of these issues highlight the importance of maintaining consistency between the database schema and the application code, especially in a TypeScript project with strict type checking.