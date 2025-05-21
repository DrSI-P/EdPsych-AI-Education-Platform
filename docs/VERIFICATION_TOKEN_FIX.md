# Verification Token Fix

## Issue

During the Vercel deployment process, we encountered a TypeScript error:

```
Type error: Type '{ identifier: string; }' is not assignable to type 'VerificationTokenWhereUniqueInput'.
  Type '{ identifier: string; }' is not assignable to type '{ token: string; identifier_token: VerificationTokenIdentifierTokenCompoundUniqueInput; } & { token?: string | undefined; ... 5 more ...; expires?: string | ... 2 more ... | undefined; }'.
    Type '{ identifier: string; }' is missing the following properties from type '{ token: string; identifier_token: VerificationTokenIdentifierTokenCompoundUniqueInput; }': token, identifier_token
```

This error occurred in `src/app/api/auth/verify-email/route.ts` on line 51, where the code was trying to query the `verificationToken` model using only the `identifier` field:

```typescript
await prisma.verificationToken.upsert({
  where: { 
    identifier: email 
  },
  // ...
});
```

## Root Cause

The `VerificationToken` model in the Prisma schema doesn't have a unique constraint on the `identifier` field alone. Instead, it has a compound unique constraint on the combination of `identifier` and `token`:

```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

This means that we can't query or update a record using only the `identifier` field. We need to use the compound unique constraint.

## Solution

1. We modified the verify-email route to handle the compound unique constraint correctly:

```typescript
// First, try to find an existing token for this email
const existingToken = await prisma.verificationToken.findFirst({
  where: { 
    identifier: email 
  }
});

if (existingToken) {
  // If token exists, delete it first
  await prisma.verificationToken.delete({
    where: { 
      identifier_token: {
        identifier: existingToken.identifier,
        token: existingToken.token
      }
    }
  });
}

// Create a new token
await prisma.verificationToken.create({
  data: {
    identifier: email,
    token: verificationToken,
    expires: verificationTokenExpiry,
  }
});
```

2. We also fixed the delete operation in the verify-email route:

```typescript
await prisma.verificationToken.delete({
  where: { 
    identifier_token: {
      identifier: verificationRecord.identifier,
      token: verificationRecord.token
    }
  },
});
```

## Lessons Learned

1. **Schema-Code Consistency**: Always ensure that the Prisma schema accurately reflects all fields and constraints used in the application code.

2. **Unique Constraints**: When working with compound unique constraints in Prisma, you need to use the correct syntax to query or update records.

3. **Type Safety**: TypeScript's type checking can help identify mismatches between the schema and the code, but only if the types are properly defined and used.

4. **Documentation**: Document any changes to the schema, especially those related to unique constraints, to help future developers understand the system's design.

## Related Issues

This issue is similar to the User password field issue documented in [USER_PASSWORD_FIELD_FIX.md](./USER_PASSWORD_FIELD_FIX.md), the PasswordReset model issue documented in [PASSWORD_RESET_MODEL_FIX.md](./PASSWORD_RESET_MODEL_FIX.md), and the AssessmentTemplate model issue documented in [MIGRATION_FIX.md](./MIGRATION_FIX.md), where models or fields were referenced in the code but not defined correctly in the schema.