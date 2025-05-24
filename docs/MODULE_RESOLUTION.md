/**
 * Module Resolution Documentation
 * 
 * This document outlines the standardized module resolution approach
 * for the EdPsych AI Education Platform.
 */

# Module Resolution Standards

## Path Aliases

The following path aliases have been configured in `tsconfig.json` to standardize imports:

| Alias | Path | Purpose |
|-------|------|---------|
| `@/components/*` | `./src/components/*` | UI components |
| `@/lib/*` | `./src/lib/*` | Core libraries and utilities |
| `@/styles/*` | `./src/styles/*` | CSS and styling files |
| `@/utils/*` | `./src/utils/*` | Utility functions |
| `@/hooks/*` | `./src/hooks/*` | React hooks |
| `@/types/*` | `./src/types/*` | TypeScript type definitions |
| `@/contexts/*` | `./src/contexts/*` | React context providers |
| `@/constants/*` | `./src/constants/*` | Constant values |
| `@/services/*` | `./src/services/*` | Service layer implementations |
| `@/assets/*` | `./public/assets/*` | Static assets |
| `@/*` | `./src/*` | Root source directory |

## Import Standards

### Preferred Import Format

```typescript
// Preferred: Using path aliases
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { useAuth } from '@/hooks/use-auth';

// Avoid: Using relative paths
import { Button } from '../../components/ui/button';
import { db } from '../../../lib/db';
```

### Import Order

1. External packages
2. Path alias imports (sorted alphabetically)
3. Relative imports (if absolutely necessary)
4. CSS/SCSS imports

Example:

```typescript
// External packages
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Path alias imports
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { User } from '@/types/user';

// CSS imports
import '@/styles/component.css';
```

## Avoiding Circular Dependencies

To prevent circular dependencies:

1. Create shared types in dedicated files
2. Use interface segregation
3. Implement unidirectional data flow
4. Use dependency injection where appropriate

## Standardization Script

A utility script has been created to help standardize imports across the codebase:

```bash
node scripts/standardize-imports.js
```

This script automatically converts relative imports to use the appropriate path aliases.

## Best Practices

1. Always use path aliases for imports
2. Group related functionality in dedicated modules
3. Avoid deep nesting of components
4. Keep component files focused on a single responsibility
5. Use index files to simplify imports from directories with multiple exports

## Module Structure

The codebase follows a feature-based organization:

- `src/components/` - Reusable UI components
- `src/lib/` - Core libraries and utilities
- `src/app/` - Next.js app router pages and layouts
- `src/hooks/` - Custom React hooks
- `src/contexts/` - React context providers
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions
- `src/styles/` - Global styles and themes
