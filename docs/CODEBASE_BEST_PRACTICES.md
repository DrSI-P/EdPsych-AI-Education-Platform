# EdPsych AI Education Platform: Codebase Best Practices

This documentation provides guidelines and best practices for maintaining the EdPsych AI Education Platform codebase, with a focus on preventing common build errors and ensuring code quality.

## Table of Contents
1. [Prisma Schema Best Practices](#prisma-schema-best-practices)
2. [TypeScript Type Safety Guidelines](#typescript-type-safety-guidelines)
3. [Common Build Error Patterns](#common-build-error-patterns)
4. [Code Organization](#code-organization)
5. [Testing Recommendations](#testing-recommendations)

## Prisma Schema Best Practices

### Model Naming Conventions
- Use PascalCase for model names (e.g., `User`, `CurriculumPlan`, `PortfolioProfile`)
- Use camelCase for field names (e.g., `firstName`, `createdAt`, `userId`)
- Be consistent with naming across the entire schema

### Relation Fields
- Always define both sides of a relation
- For one-to-many relations, ensure the "many" side has a field referencing the "one" side
- For the User model, include relation fields for all models that reference it
- Example:
  ```prisma
  model User {
    id        String    @id @default(uuid())
    profiles  Profile[]
  }

  model Profile {
    id        String    @id @default(uuid())
    userId    String
    user      User      @relation(fields: [userId], references: [id])
  }
  ```

### Schema Changes and Migrations
- Always create migrations for schema changes using `prisma migrate dev`
- Document breaking changes in migration files
- Test migrations on a development database before deploying
- Consider data preservation when modifying existing models
- When adding new models, ensure all relation fields are properly defined

### Field Types and Defaults
- Use appropriate field types (String, Int, Boolean, DateTime, etc.)
- Provide default values where appropriate
- Use enums for fields with a fixed set of possible values
- Mark optional fields with `?` (e.g., `bio String?`)

## TypeScript Type Safety Guidelines

### Interface and Type Definitions
- Define interfaces for all data structures
- Export interfaces that are used across multiple files
- Ensure all interface declarations for the same name are either all exported or all local
- Place interface definitions at the top of the file or in a separate types file

### Array Type Declarations
- Always explicitly type arrays: `const items: Item[] = []`
- Avoid using `any[]` type; be specific about array contents
- For empty arrays that will be populated later, still provide the type: `const users: User[] = []`

### Function Parameters and Return Types
- Explicitly type function parameters and return values
- Use TypeScript utility types (Partial, Omit, Pick, etc.) when appropriate
- Example:
  ```typescript
  function getUserById(id: string): Promise<User | null> {
    // Implementation
  }
  ```

### API Routes
- Define request and response types for all API routes
- Use zod or similar libraries for runtime validation
- Ensure consistent error response structures

## Common Build Error Patterns

### Prisma-Related Errors
- Missing relation fields: Ensure both sides of relations are defined
- Case mismatches: Be consistent with PascalCase for models and camelCase for fields
- Undefined models: Ensure all models referenced in code exist in the schema
- Migration conflicts: Resolve conflicts before creating new migrations

### TypeScript Errors
- Implicit any types: Always provide explicit types
- Interface conflicts: Ensure consistent export/local status for interfaces
- Type narrowing: Use proper type guards when narrowing types
- Missing type definitions: Create types for all data structures

### Next.js Build Errors
- API route exports: Ensure proper export of handler functions
- Client/server code mixing: Avoid importing server-only code in client components
- Environment variables: Properly prefix client-side variables with NEXT_PUBLIC_
- Image optimization: Use Next.js Image component with proper configuration

## Code Organization

### Directory Structure
- Group related functionality in directories
- Separate API routes by domain (e.g., `/api/professional-development`, `/api/ai`)
- Place shared types in dedicated type files
- Use barrel exports (index.ts) for cleaner imports

### Component Organization
- Split large components into smaller, focused ones
- Separate UI components from data fetching logic
- Use custom hooks for reusable logic
- Implement proper prop typing for all components

### State Management
- Choose appropriate state management based on complexity
- Document state structures and update patterns
- Avoid prop drilling by using context or state management libraries
- Implement proper error handling for async operations

## Testing Recommendations

### Unit Testing
- Test individual functions and components
- Mock external dependencies
- Focus on edge cases and error handling
- Ensure high coverage of utility functions

### Integration Testing
- Test API routes with mock requests
- Verify database operations with test databases
- Test component interactions
- Validate form submissions and user flows

### End-to-End Testing
- Test critical user journeys
- Verify authentication flows
- Test responsive design across devices
- Validate accessibility requirements

### Continuous Integration
- Run tests on every pull request
- Implement linting and type checking in CI
- Verify build success before merging
- Deploy to staging environments for manual testing

---

By following these best practices, we can maintain a high-quality codebase, prevent common build errors, and ensure a smooth development experience for all contributors to the EdPsych AI Education Platform.
