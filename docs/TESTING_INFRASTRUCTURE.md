# Testing Infrastructure and Coverage Documentation

This document provides comprehensive documentation for the testing infrastructure and coverage setup for the EdPsych-AI-Education-Platform.

## Overview

The EdPsych-AI-Education-Platform implements a robust testing infrastructure using Jest for unit and component testing, and Playwright for end-to-end (E2E) testing. This setup ensures high-quality code, reliable functionality, and consistent user experience across the platform.

## Testing Architecture

### Testing Layers

The platform uses a multi-layered testing approach:

1. **Unit Tests**
   - Purpose: Test individual functions and utilities in isolation
   - Location: `src/tests/lib/`
   - Naming Convention: `*.test.ts`

2. **Component Tests**
   - Purpose: Test React components in isolation
   - Location: `src/tests/components/`
   - Naming Convention: `*.test.tsx`

3. **Integration Tests**
   - Purpose: Test interactions between multiple components or services
   - Location: `src/tests/integration/`
   - Naming Convention: `*.test.tsx`

4. **End-to-End Tests**
   - Purpose: Test complete user flows and scenarios
   - Location: `src/tests/e2e/`
   - Naming Convention: `*.spec.ts`

### Testing Tools

- **Jest**: JavaScript testing framework for unit, component, and integration tests
- **React Testing Library**: Utilities for testing React components
- **Playwright**: Framework for E2E testing across multiple browsers
- **User Event**: Library for simulating user interactions in tests
- **Jest DOM**: Custom Jest matchers for DOM testing

## Configuration

### Jest Configuration

The Jest configuration is defined in `jest.config.js`:

```javascript
/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/tests/__mocks__/fileMock.js'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@next|next)/)'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_*.{js,jsx,ts,tsx}',
    '!src/**/*.stories.{js,jsx,ts,tsx}'
  ]
};

module.exports = config;
```

Key aspects of this configuration:
- **Test Environment**: JSDOM for simulating browser environment
- **Setup Files**: Custom setup in `jest.setup.js` for global mocks and configurations
- **Module Mapping**: Aliases for imports and handling of non-JS assets
- **Transformations**: Babel for JS/TS/JSX/TSX files
- **Coverage Collection**: Configured to track coverage across all source files

### Babel Configuration

The Babel configuration is defined in `babel.config.js`:

```javascript
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
};
```

This configuration ensures proper transformation of:
- Modern JavaScript features (ES6+)
- React JSX syntax
- TypeScript code

### Playwright Configuration

The Playwright configuration is defined in `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests/e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/test-results.json' }]
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Microsoft Edge',
      use: { channel: 'msedge' },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

Key aspects of this configuration:
- **Test Directory**: E2E tests located in `src/tests/e2e`
- **Timeouts**: Configured for both tests and expectations
- **Parallelization**: Tests run in parallel for efficiency
- **Reporting**: HTML and JSON reports generated
- **Browser Projects**: Tests run across multiple browsers and devices
- **Web Server**: Automatically starts the development server for tests

## Test Setup

### Jest Setup

The Jest setup file (`src/tests/jest.setup.js`) configures the testing environment with necessary mocks and polyfills:

```javascript
// Jest setup file
require('@testing-library/jest-dom');
require('whatwg-fetch');
const { TextDecoder, TextEncoder } = require('util');

// Mock the global fetch
global.fetch = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Speech Recognition API
global.SpeechRecognition = jest.fn().mockImplementation(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

global.webkitSpeechRecognition = global.SpeechRecognition;

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Suppress console errors during tests
jest.spyOn(console, 'error').mockImplementation(() => {});
```

This setup provides:
- DOM testing utilities
- Fetch API polyfill
- Mocks for browser APIs (IntersectionObserver, ResizeObserver, etc.)
- Mocks for storage (localStorage, sessionStorage)
- Mocks for speech recognition APIs
- Suppression of console errors during tests

### File Mocks

The file mock (`src/tests/__mocks__/fileMock.js`) provides a simple mock for file imports:

```javascript
module.exports = 'test-file-stub';
```

## Writing Tests

### Unit Tests

Example unit test for a validation utility:

```typescript
import { validateEmail, validatePassword } from '@/lib/validation';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    test('returns true for valid email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('name.surname@domain.co.uk')).toBe(true);
    });

    test('returns false for invalid email addresses', () => {
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user@domain')).toBe(false);
      expect(validateEmail('user.domain.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('returns true for valid passwords', () => {
      expect(validatePassword('Password123!')).toBe(true);
    });

    test('returns false for passwords without uppercase letters', () => {
      expect(validatePassword('password123!')).toBe(false);
    });

    test('returns false for passwords without lowercase letters', () => {
      expect(validatePassword('PASSWORD123!')).toBe(false);
    });

    test('returns false for passwords without numbers', () => {
      expect(validatePassword('Password!')).toBe(false);
    });

    test('returns false for passwords without special characters', () => {
      expect(validatePassword('Password123')).toBe(false);
    });

    test('returns false for passwords shorter than 8 characters', () => {
      expect(validatePassword('Pass1!')).toBe(false);
    });
  });
});
```

### Component Tests

Example component test for a UI component:

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@/components/theme-provider';
import LearningCard from '@/components/ui/LearningCard';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe('LearningCard Component', () => {
  const defaultProps = {
    title: 'Test Learning Card',
    description: 'This is a test description',
    imageUrl: '/test-image.jpg',
    href: '/test-link',
    category: 'Mathematics',
    level: 'Intermediate',
  };

  test('renders with all props correctly', () => {
    render(
      <ThemeProvider>
        <LearningCard {...defaultProps} />
      </ThemeProvider>
    );

    // Check if title and description are rendered
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    
    // Check if category and level are rendered
    expect(screen.getByText(defaultProps.category)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.level)).toBeInTheDocument();
    
    // Check if image is rendered with correct alt text
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', expect.stringContaining(defaultProps.imageUrl));
    expect(image).toHaveAttribute('alt', expect.stringContaining(defaultProps.title));
    
    // Check if the card is clickable (wrapped in a link)
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', defaultProps.href);
  });

  // Additional tests...
});
```

### E2E Tests

Example E2E test for the homepage:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Verify the page title
    await expect(page).toHaveTitle(/EdPsych Connect/);
    
    // Verify key elements are present
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('/');
    
    // Check that navigation links exist
    const navLinks = page.locator('nav a');
    await expect(navLinks).toHaveCount(await navLinks.count());
    
    // Click on the first navigation link and verify navigation
    const firstLink = navLinks.first();
    const href = await firstLink.getAttribute('href');
    if (href && !href.startsWith('http')) {
      await firstLink.click();
      // Wait for navigation to complete
      await page.waitForLoadState('networkidle');
      // Verify we're on a different page
      expect(page.url()).not.toBe('/');
    }
  });

  // Additional tests...
});
```

## Running Tests

The following npm scripts are available for running tests:

- `npm test`: Run all Jest tests
- `npm test -- --testPathPattern=path/to/test`: Run specific Jest tests
- `npm run test:watch`: Run Jest tests in watch mode
- `npm run test:coverage`: Run Jest tests with coverage reporting
- `npm run test:e2e`: Run Playwright E2E tests

## Test Coverage

Test coverage is tracked using Jest's built-in coverage reporter. The configuration in `jest.config.js` specifies which files to include in coverage calculations.

To generate a coverage report:

```bash
npm run test:coverage
```

This will create a coverage report in the `coverage` directory, which can be viewed in a browser by opening `coverage/lcov-report/index.html`.

## CI/CD Integration

The testing infrastructure is integrated with the CI/CD pipeline defined in `.github/workflows/ci-cd.yml`. The workflow includes:

1. **Lint**: Code quality checks using ESLint
2. **Test**: Automated testing with Jest
3. **Build**: Application build process
4. **Deploy**: Deployment to staging or production environments

Tests are run automatically on pull requests and pushes to main branches, ensuring code quality and preventing regressions.

## Best Practices

### Writing Effective Tests

1. **Test Behavior, Not Implementation**: Focus on what the code does, not how it does it
2. **Keep Tests Independent**: Each test should run in isolation
3. **Use Descriptive Test Names**: Names should clearly describe what is being tested
4. **Follow the AAA Pattern**: Arrange, Act, Assert
5. **Mock External Dependencies**: Use Jest's mocking capabilities for external services
6. **Test Edge Cases**: Include tests for boundary conditions and error scenarios
7. **Maintain Test Readability**: Keep tests simple and easy to understand

### Component Testing Guidelines

1. **Test User Interactions**: Simulate clicks, form submissions, etc.
2. **Test Accessibility**: Verify ARIA attributes and keyboard navigation
3. **Test Responsiveness**: Verify components adapt to different screen sizes
4. **Test Error States**: Verify components handle errors gracefully
5. **Test Loading States**: Verify components display loading indicators

### E2E Testing Guidelines

1. **Focus on Critical Paths**: Test the most important user journeys
2. **Test Across Browsers**: Verify functionality in different browsers
3. **Test Responsive Design**: Verify functionality on different devices
4. **Test Performance**: Monitor load times and responsiveness
5. **Test Accessibility**: Verify WCAG compliance

## Troubleshooting

### Common Issues and Solutions

1. **Tests Failing Due to DOM Changes**:
   - Update test selectors to match new DOM structure
   - Use more resilient selectors (e.g., test IDs)

2. **Tests Timing Out**:
   - Increase timeout settings in test configuration
   - Check for asynchronous operations that aren't being properly awaited

3. **Mock Not Working**:
   - Verify mock is defined before the module is imported
   - Check mock implementation matches expected interface

4. **Coverage Reports Inaccurate**:
   - Verify collectCoverageFrom patterns in Jest config
   - Ensure tests are actually executing the code paths

5. **E2E Tests Flaky**:
   - Add explicit waits for network/animation completion
   - Increase retry counts for CI environments
   - Use more specific selectors

## Conclusion

This testing infrastructure provides a robust foundation for ensuring the quality and reliability of the EdPsych-AI-Education-Platform. By combining unit, component, integration, and E2E tests, the platform benefits from comprehensive test coverage across all layers of the application. The configuration and setup described in this document enable efficient testing workflows for both development and CI/CD environments.
