# EdPsych Connect CSS Troubleshooting Guide for RooCode

## Overview
This document provides detailed instructions for troubleshooting and fixing the CSS styling issues on the EdPsych Connect platform. The platform is currently experiencing styling problems where CSS classes are not being properly applied in the production environment, despite successful builds.

## Current Issues
1. Custom CSS classes are not being applied to elements
2. Button styling is missing (showing as plain black instead of branded colors)
3. Text gradient effects are not displaying
4. Animation classes are not working
5. Logo and image assets are returning 404 errors

## Repository Information
- Repository URL: https://github.com/DrSI-P/EdPsych-AI-Education-Platform.git
- Branch for CSS debugging: `css-debug`
- Main development branch: `complete-rebuild`

## Root Causes Identified
1. **Tailwind CSS Purging**: The build process is likely purging CSS classes that it doesn't detect in use
2. **Invalid @apply Directives**: Some CSS files contain invalid Tailwind @apply directives
3. **Asset Path Resolution**: Image paths are not being correctly resolved during build
4. **CSS Loading Order**: CSS files may not be loading in the correct order
5. **Next.js App/Pages Router Conflict**: Conflicts between `/pages` and `/src/app` directories

## Debugging Steps

### 1. Local Environment Setup
```bash
# Clone the repository
git clone https://github.com/DrSI-P/EdPsych-AI-Education-Platform.git

# Switch to the complete-rebuild branch
git checkout complete-rebuild

# Install dependencies
npm install

# Run development server
npm run dev
```

### 2. CSS File Inspection
Examine the following CSS files for issues:
- `/src/styles/brand.css`
- `/src/styles/enhanced-brand.css`
- `/src/styles/global-styles.css`
- `/public/styles/global.css`

Look for:
- Invalid Tailwind @apply directives
- Missing CSS variables
- Incorrect import paths

### 3. Tailwind Configuration Fixes
Modify the `tailwind.config.js` file to prevent purging of critical CSS classes:

```javascript
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/styles/**/*.css',
  ],
  safelist: [
    // Add critical classes that should never be purged
    'text-gradient',
    'animate-fade-in',
    'animate-slide-up',
    'btn-primary',
    'btn-secondary',
    /^bg-/,
    /^text-/,
    /^hover:/,
  ],
  theme: {
    // Theme configuration...
  },
  plugins: [],
}
```

### 4. Next.js Configuration Fixes
Update `next.config.js` to ensure CSS is properly processed:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  appDir: false, // Ensure only Pages Router is used
  images: {
    domains: ['edpsychconnect.com', 'www.edpsychconnect.com'],
  },
  // Disable CSS optimization to prevent class purging
  optimizeCss: false,
  webpack: (config) => {
    // Custom webpack configuration to fix CSS processing
    return config;
  },
}

module.exports = nextConfig
```

### 5. CSS Module Approach
Convert critical CSS files to CSS modules to ensure they're included in the build:

1. Rename `brand.css` to `Brand.module.css`
2. Update imports in components:
```javascript
import styles from '@/styles/Brand.module.css';

// Then use:
<div className={styles.textGradient}>...</div>
```

### 6. Inline Critical CSS
Add critical CSS directly to `_document.tsx`:

```tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Inline critical CSS */}
          <style dangerouslySetInnerHTML={{ __html: `
            .text-gradient {
              background: linear-gradient(to right, #6366f1, #8b5cf6);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              color: transparent;
            }
            .btn-primary {
              background-color: #6366f1;
              color: white;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              font-weight: 500;
              transition: all 0.3s ease;
              display: inline-block;
              text-decoration: none;
            }
            /* Add other critical styles here */
          `}} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

### 7. Public Directory Asset Verification
Ensure all required assets exist in the `/public` directory:

```bash
# Create directories if they don't exist
mkdir -p public/images
mkdir -p public/styles

# Add missing logo file
touch public/images/logo-full.svg

# Add global CSS file
touch public/styles/global.css
```

### 8. Build and Deployment Testing
Test the build process locally:

```bash
# Build the project
npm run build

# Start the production server
npm run start
```

Verify that:
- CSS is correctly included in the build output
- Assets are properly referenced
- Styles are applied as expected

### 9. Vercel-Specific Fixes
Create a `.vercelignore` file to prevent conflicts:

```
src/app
```

### 10. Diagnostic Tools
Use these browser console commands to diagnose CSS issues on the live site:

```javascript
// Check which CSS files are being loaded
Array.from(document.styleSheets).forEach(sheet => {
  console.log(sheet.href);
});

// Check if specific classes exist in the CSS
function checkCssClass(className) {
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.selectorText && rule.selectorText.includes(className)) {
          console.log('Found:', rule.selectorText, 'in', sheet.href);
          console.log('Style:', rule.style.cssText);
          return true;
        }
      }
    } catch (e) {
      console.log('Cannot read cssRules from', sheet.href);
    }
  }
  console.log('Class not found:', className);
  return false;
}

// Test critical classes
checkCssClass('text-gradient');
checkCssClass('btn-primary');
```

## Alternative Approaches to Try

### Option A: Use Next.js CSS Modules

1. Create CSS modules for components:
```
src/styles/Button.module.css
src/styles/Navigation.module.css
```

2. Import and use in components:
```jsx
import styles from '../styles/Button.module.css';

<button className={styles.primary}>Click Me</button>
```

### Option B: Use Styled Components or Emotion

1. Install styled-components:
```bash
npm install styled-components
```

2. Create styled components:
```jsx
import styled from 'styled-components';

const Button = styled.button`
  background-color: #6366f1;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  /* ... */
`;
```

### Option C: Create a Minimal Test Page

Create a minimal test page with basic styling to isolate the issue:

```jsx
// pages/test-styling.js
export default function TestStyling() {
  return (
    <div>
      <h1 style={{ color: 'blue' }}>Inline Style Test</h1>
      <button style={{ 
        backgroundColor: '#6366f1', 
        color: 'white',
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        border: 'none'
      }}>
        Test Button
      </button>
    </div>
  );
}
```

## Recommended Solutions (In Priority Order)

1. **Direct CSS Inclusion**: Add CSS directly to public/styles/global.css and reference it in a <link> tag in _document.tsx
2. **CSS Module Conversion**: Convert critical CSS to CSS modules
3. **Safelist Critical Classes**: Update Tailwind config to prevent purging
4. **Fix Asset Paths**: Ensure all assets are in the public directory with correct paths
5. **Inline Critical CSS**: Add critical styles directly to _document.tsx
6. **Disable CSS Optimization**: Modify next.config.js to prevent optimization

## Testing and Verification
After implementing fixes:
1. Build and deploy the project
2. Verify all styles are applied correctly
3. Check browser console for any remaining 404 errors
4. Test across different browsers and devices
5. Validate that all interactive elements have proper styling

## Reporting Back

After investigating and implementing potential solutions, please:

1. Document all findings in a detailed report
2. Note which approaches were attempted and their results
3. Provide a clear explanation of the root cause once identified
4. Implement the solution in the css-debug branch
5. Create a pull request to merge the fix into the complete-rebuild branch

## Contact Information
If you encounter issues or need clarification, please contact the technical director through the project management system.

Good luck with the CSS debugging!
