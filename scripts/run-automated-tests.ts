// Automated Testing Script for EdPsych AI Education Platform
// This script runs automated tests on components and pages

import { TestingUtility } from '../lib/testing-utility';
import { chromium, firefox, webkit, Browser, Page } from 'playwright';

// Initialize testing utility
const testingUtil = new TestingUtility('./testing-reports/automated-test-report.json');

// Test configuration
const config = {
  browsers: ['chromium', 'firefox', 'webkit'],
  viewports: [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 800 }
  ],
  baseUrl: 'http://localhost:3000',
  pages: [
    { name: 'Home', path: '/' },
    { name: 'Visual Design Showcase', path: '/visual-design-showcase' },
    { name: 'Testing Page', path: '/testing' },
    { name: 'Voice Input Demo', path: '/accessibility/voice-input-demo' }
  ],
  components: [
    'VoiceInput',
    'VoiceInputField',
    'VisualCard',
    'VisualLearningContainer',
    'SubjectIcon',
    'ProgressVisualization',
    'ConceptMap',
    'LearningModuleCard',
    'VisualLearningPath',
    'AccessibilitySettings',
    'AccessibilityMenu'
  ]
};

// Main test function
async function runTests() {
  console.log('Starting automated tests...');
  testingUtil.clearReport();
  
  // Test each browser
  for (const browserType of config.browsers) {
    console.log(`Testing on ${browserType}...`);
    let browser: Browser;
    
    try {
      // Launch browser
      switch (browserType) {
        case 'chromium':
          browser = await chromium.launch();
          break;
        case 'firefox':
          browser = await firefox.launch();
          break;
        case 'webkit':
          browser = await webkit.launch();
          break;
        default:
          throw new Error(`Unsupported browser type: ${browserType}`);
      }
      
      // Test each viewport
      for (const viewport of config.viewports) {
        console.log(`Testing on ${viewport.name} viewport...`);
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height }
        });
        
        // Test each page
        for (const page of config.pages) {
          console.log(`Testing page: ${page.name}`);
          const pageObj = await context.newPage();
          
          try {
            // Navigate to page
            await pageObj.goto(`${config.baseUrl}${page.path}`);
            
            // Test page loading
            await testPageLoading(pageObj, page.name, browserType, viewport.name);
            
            // Test components on page
            await testComponentsOnPage(pageObj, page.name, browserType, viewport.name);
            
            // Test accessibility
            await testAccessibility(pageObj, page.name, browserType, viewport.name);
            
            // Test responsiveness
            await testResponsiveness(pageObj, page.name, browserType, viewport.name);
            
          } catch (error) {
            console.error(`Error testing page ${page.name}:`, error);
            testingUtil.addResult({
              component: page.name,
              feature: 'Page Loading',
              status: 'failed',
              browser: browserType,
              device: viewport.name,
              errorMessage: error instanceof Error ? error.message : String(error)
            });
          } finally {
            await pageObj.close();
          }
        }
        
        await context.close();
      }
      
      await browser.close();
      
    } catch (error) {
      console.error(`Error with browser ${browserType}:`, error);
    }
  }
  
  // Print summary
  console.log(testingUtil.getSummary());
  console.log('Failed tests:', testingUtil.getFailedTests());
}

// Test page loading
async function testPageLoading(page: Page, pageName: string, browser: string, device: string) {
  try {
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Check if page has expected title
    const title = await page.title();
    if (!title) {
      throw new Error('Page title is empty');
    }
    
    // Check if page has main content
    const hasContent = await page.evaluate(() => {
      return document.body.textContent!.length > 0;
    });
    
    if (!hasContent) {
      throw new Error('Page has no content');
    }
    
    testingUtil.addResult({
      component: pageName,
      feature: 'Page Loading',
      status: 'passed',
      browser,
      device
    });
    
  } catch (error) {
    testingUtil.addResult({
      component: pageName,
      feature: 'Page Loading',
      status: 'failed',
      browser,
      device,
      errorMessage: error instanceof Error ? error.message : String(error)
    });
  }
}

// Test components on page
async function testComponentsOnPage(page: Page, pageName: string, browser: string, device: string) {
  // For each component, check if it exists on the page
  for (const component of config.components) {
    try {
      // Check for component by class name (simplified approach)
      const hasComponent = await page.evaluate((comp) => {
        // Convert component name to kebab case for class search
        const kebabCase = comp.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        return document.querySelector(`.${kebabCase}`) !== null;
      }, component);
      
      if (hasComponent) {
        testingUtil.addResult({
          component,
          feature: 'Rendering',
          status: 'passed',
          browser,
          device
        });
      }
    } catch (error) {
      // Not logging failures here as not all components will be on every page
    }
  }
}

// Test accessibility
async function testAccessibility(page: Page, pageName: string, browser: string, device: string) {
  try {
    // Basic accessibility checks
    const accessibilityIssues = await page.evaluate(() => {
      const issues = [];
      
      // Check for alt text on images
      const images = document.querySelectorAll('img');
      for (const img of Array.from(images)) {
        if (!img.hasAttribute('alt')) {
          issues.push('Image missing alt text');
          break;
        }
      }
      
      // Check for form labels
      const inputs = document.querySelectorAll('input, textarea, select');
      for (const input of Array.from(inputs)) {
        const id = input.getAttribute('id');
        if (id && !document.querySelector(`label[for="${id}"]`)) {
          issues.push('Input missing associated label');
          break;
        }
      }
      
      // Check heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let previousLevel = 0;
      for (const heading of Array.from(headings)) {
        const level = parseInt(heading.tagName.charAt(1));
        if (previousLevel > 0 && level > previousLevel + 1) {
          issues.push('Heading levels skipped');
          break;
        }
        previousLevel = level;
      }
      
      return issues;
    });
    
    if (accessibilityIssues.length === 0) {
      testingUtil.addResult({
        component: pageName,
        feature: 'Accessibility',
        status: 'passed',
        browser,
        device
      });
    } else {
      testingUtil.addResult({
        component: pageName,
        feature: 'Accessibility',
        status: 'failed',
        browser,
        device,
        errorMessage: `Accessibility issues: ${accessibilityIssues.join(', ')}`
      });
    }
  } catch (error) {
    testingUtil.addResult({
      component: pageName,
      feature: 'Accessibility',
      status: 'failed',
      browser,
      device,
      errorMessage: error instanceof Error ? error.message : String(error)
    });
  }
}

// Test responsiveness
async function testResponsiveness(page: Page, pageName: string, browser: string, device: string) {
  try {
    // Check for horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    
    if (hasHorizontalOverflow) {
      testingUtil.addResult({
        component: pageName,
        feature: 'Responsiveness',
        status: 'failed',
        browser,
        device,
        errorMessage: 'Page has horizontal overflow'
      });
      return;
    }
    
    // Check if elements are properly sized for viewport
    const elementsOverflow = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (const el of Array.from(elements)) {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth + 5) { // 5px tolerance
          return true;
        }
      }
      return false;
    });
    
    if (elementsOverflow) {
      testingUtil.addResult({
        component: pageName,
        feature: 'Responsiveness',
        status: 'failed',
        browser,
        device,
        errorMessage: 'Elements overflow viewport'
      });
      return;
    }
    
    testingUtil.addResult({
      component: pageName,
      feature: 'Responsiveness',
      status: 'passed',
      browser,
      device
    });
    
  } catch (error) {
    testingUtil.addResult({
      component: pageName,
      feature: 'Responsiveness',
      status: 'failed',
      browser,
      device,
      errorMessage: error instanceof Error ? error.message : String(error)
    });
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

export { runTests };
