# Next.js Environment Variables Guide

This guide provides a comprehensive overview of how to work with environment variables in Next.js applications, with a specific focus on deployment to Vercel.

## Environment Variable Basics

Next.js has built-in support for environment variables, which allows you to:

1. Use different values in different environments (development, testing, production)
2. Access environment variables on the server side
3. Expose selected environment variables to the browser

## Environment Variable Files

Next.js supports various environment variable files:

1. `.env`: Default environment variables for all environments
2. `.env.local`: Local overrides (not committed to Git)
3. `.env.development`: Development environment variables
4. `.env.production`: Production environment variables
5. `.env.test`: Test environment variables

The loading priority is as follows (highest to lowest):
1. `process.env` (system environment variables)
2. `.env.local`
3. `.env.{environment}` (e.g., `.env.production` when `NODE_ENV` is `production`)
4. `.env`

## Server-Side vs. Client-Side Environment Variables

### Server-Side Only (Default)

By default, environment variables are only available on the server side:

```
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
API_SECRET_KEY="super-secret-key"
```

These variables can be accessed in server-side code using `process.env`:

```javascript
// This runs on the server
export async function getServerSideProps() {
  const db = await connectToDatabase(process.env.DATABASE_URL);
  // ...
  return { props: { /* ... */ } };
}
```

### Exposing to the Browser

To expose environment variables to the browser, prefix them with `NEXT_PUBLIC_`:

```
NEXT_PUBLIC_API_URL="https://api.example.com"
NEXT_PUBLIC_ANALYTICS_ID="UA-12345-6"
```

These variables can be accessed in both server-side and client-side code:

```javascript
// This runs on the client
function MyComponent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  // ...
  return <div>{/* ... */}</div>;
}
```

## Environment Variables in Vercel

### Setting Environment Variables in Vercel

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add your environment variables:
   - Name: The name of the variable (e.g., `DATABASE_URL`)
   - Value: The value of the variable
   - Environment: Select which environments the variable applies to (Production, Preview, Development)

### Environment Variable Best Practices for Vercel

1. **Use `.env.production` for local testing**:
   Create a `.env.production` file with the same variables you'll set in Vercel:

   ```
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
   NEXTAUTH_URL="https://yourdomain.com"
   NEXTAUTH_SECRET="your-secret-key"
   ```

2. **Add `.env.local` to `.gitignore`**:
   Ensure that `.env.local` is in your `.gitignore` file to prevent committing local environment variables.

3. **Use different values for different environments**:
   - Development: Local database, debug logging, etc.
   - Preview: Staging database, reduced logging, etc.
   - Production: Production database, minimal logging, etc.

4. **Encrypt sensitive environment variables**:
   For highly sensitive values, consider using Vercel's encrypted environment variables feature.

## Environment Variables for Common Use Cases

### Database Connection

```
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

### Authentication (NextAuth.js)

```
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### API Keys

```
NEXT_PUBLIC_MAPBOX_TOKEN="your-mapbox-token"
STRIPE_SECRET_KEY="your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
```

### Feature Flags

```
NEXT_PUBLIC_FEATURE_NEW_DASHBOARD="true"
NEXT_PUBLIC_FEATURE_BETA_API="false"
```

## Runtime vs. Build-Time Environment Variables

### Build-Time Environment Variables

Environment variables are embedded into your application at build time. This means:

1. If you change an environment variable in Vercel, you need to redeploy your application for the changes to take effect.
2. The values of environment variables are fixed at build time, not at runtime.

### Runtime Environment Variables

For truly dynamic environment variables that can change without redeployment, you need to use a different approach:

1. **Server-Side Rendering (SSR)**:
   Use `getServerSideProps` to fetch the latest values at request time.

2. **API Routes**:
   Create an API route that returns the necessary configuration:

   ```javascript
   // pages/api/config.js
   export default function handler(req, res) {
     res.status(200).json({
       apiUrl: process.env.API_URL,
       featureFlags: {
         newDashboard: process.env.FEATURE_NEW_DASHBOARD === 'true',
       },
     });
   }
   ```

   Then fetch this configuration from your client-side code.

## Environment Variable Validation

It's a good practice to validate your environment variables at startup:

```javascript
// utils/validateEnv.js
export function validateEnv() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`
    );
  }
}
```

You can call this function in your `next.config.js`:

```javascript
// next.config.js
const { validateEnv } = require('./utils/validateEnv');

// Only validate in production to avoid issues during development
if (process.env.NODE_ENV === 'production') {
  validateEnv();
}

module.exports = {
  // your Next.js config
};
```

## TypeScript Support for Environment Variables

For TypeScript projects, you can add type definitions for your environment variables:

```typescript
// types/environment.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      DATABASE_URL: string;
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      NEXT_PUBLIC_API_URL: string;
      // Add other environment variables here
    }
  }
}

// If this file has no imports/exports, add this line to make it a module
export {};
```

## Environment Variables in CI/CD

### GitHub Actions

For GitHub Actions, you can set environment variables in your workflow file:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}
          NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Vercel CLI

When deploying with the Vercel CLI, you can use a `.vercel.env` file or pass environment variables directly:

```bash
vercel --env DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

## Troubleshooting Environment Variables

### Common Issues

1. **Environment variables not available in the browser**:
   - Ensure they are prefixed with `NEXT_PUBLIC_`
   - Rebuild and redeploy your application

2. **Environment variables not updated after changing in Vercel**:
   - Redeploy your application to apply the changes

3. **Environment variables not available in API routes**:
   - Check that they are correctly set in Vercel
   - Verify that they are not prefixed with `NEXT_PUBLIC_` if they should be server-side only

4. **Different values in development and production**:
   - Check that the variables are set correctly in both environments
   - Verify that `.env.local` isn't overriding values in development

### Debugging Environment Variables

To debug environment variables, you can add a temporary API route:

```javascript
// pages/api/debug-env.js (REMOVE IN PRODUCTION)
export default function handler(req, res) {
  // Only enable in development
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).end();
  }

  // Filter out sensitive information
  const safeEnv = Object.fromEntries(
    Object.entries(process.env).filter(
      ([key]) => !key.includes('SECRET') && !key.includes('PASSWORD')
    )
  );

  res.status(200).json(safeEnv);
}
```

## Security Considerations

1. **Never commit sensitive environment variables to Git**:
   - Add `.env.local`, `.env.development.local`, `.env.test.local`, and `.env.production.local` to your `.gitignore` file
   - Use Vercel's environment variable UI to set sensitive values

2. **Limit exposure of environment variables to the browser**:
   - Only prefix with `NEXT_PUBLIC_` when necessary
   - Create API routes to expose limited configuration to the client

3. **Rotate secrets regularly**:
   - Update API keys, database passwords, and other secrets regularly
   - Use different secrets for different environments

4. **Use environment variable validation**:
   - Validate required environment variables at startup
   - Validate the format of environment variables (e.g., URLs, API keys)

## Best Practices Summary

1. **Use appropriate environment variable files**:
   - `.env.local` for local development
   - `.env.production` for production configuration
   - `.env.test` for test configuration

2. **Prefix browser-accessible variables with `NEXT_PUBLIC_`**

3. **Set environment variables in Vercel for each environment**:
   - Production
   - Preview
   - Development

4. **Validate environment variables at startup**

5. **Add TypeScript definitions for environment variables**

6. **Never commit sensitive environment variables to Git**

7. **Use different values for different environments**

8. **Document required environment variables**:
   - Create a `.env.example` file with all required variables (without values)
   - Add documentation in your README

9. **Consider using a library like `envalid` for more advanced validation**

10. **Implement proper error handling for missing environment variables**