# Package Name Fix

## Issue

During our standardization to UK spelling throughout the codebase, we inadvertently affected package names in dependency files. This caused build failures in Vercel because npm couldn't find packages with UK spelling variants like "colour-name" and "supports-colour" as these packages don't exist in the npm registry - they're published with US spelling as "color-name" and "supports-color".

The build error looked like this:

```
npm error code E404
npm error 404 Not Found - GET https://registry.npmjs.org/supports-colour/-/supports-colour-7.2.0.tgz - Not found
npm error 404
npm error 404  'supports-colour'https://registry.npmjs.org/supports-colour/-/supports-colour-7.2.0.tgz'' (see below for site content) is not in this registry.
```

## Solution

We created a script `fix-package-names.js` that specifically targets package names in dependency files (package-lock.json and yarn.lock if present) and reverts UK spelling back to US spelling for these names. This ensures compatibility with the npm registry.

The script:

1. Identifies UK spelling variants in package names (e.g., "colour-name", "supports-colour")
2. Reverts them back to US spelling (e.g., "color-name", "supports-color")
3. Also fixes URLs to the npm registry that contain these package names

This fix is important because while we want to maintain UK spelling in our codebase for consistency with UK educational standards, we need to use the original US spelling for package names to ensure compatibility with the npm ecosystem.

## Implementation

The fix script is added to the `apply-all-fixes.js` pipeline right after the `fix-uk-spelling.js` script to ensure that any UK spelling changes to package names are immediately reverted.

```javascript
// In apply-all-fixes.js
const fixScripts = [
  // ...
  'fix-uk-spelling.js',
  'fix-package-names.js', // Fix UK spelling in package names
  // ...
];
```

## Best Practices

When standardizing spelling in a codebase:

1. Always exclude package names and other external identifiers from spelling changes
2. Add exceptions for library names, API endpoints, and other external references
3. Consider using a more targeted approach for spelling standardization that only affects your own code, not dependencies

## Related Issues

- [SCHEMA_CODE_MISMATCH_FIX.md](./SCHEMA_CODE_MISMATCH_FIX.md) - Fixing case sensitivity issues
- [TYPESCRIPT_IMPLICIT_ANY_FIX.md](./TYPESCRIPT_IMPLICIT_ANY_FIX.md) - Fixing TypeScript errors