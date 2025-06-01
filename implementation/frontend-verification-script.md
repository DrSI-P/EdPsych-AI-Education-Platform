# EdPsych Connect Frontend Verification Script

This script helps verify that the frontend is correctly displaying the updated codebase by checking for specific elements and routes.

```javascript
// Run this in your browser console on edpsychconnect.com

console.log("Starting EdPsych Connect Frontend Verification...");

// Check for professional development routes
const routesToCheck = [
  '/professional-development',
  '/professional-development/foundations',
  '/professional-development/trauma-informed-practice',
  '/professional-development/technology-in-education',
  '/professional-development/teaching-assistant-development',
  '/professional-development/leadership-in-educational-psychology',
  '/professional-development/parent-family-engagement',
  '/professional-development/emotionally-based-school-non-attendance',
  '/professional-development/certification',
  '/professional-development/micro-learning'
];

// Function to check if a route exists
async function checkRoute(route) {
  try {
    const response = await fetch(route, { method: 'HEAD' });
    console.log(`Route ${route}: ${response.ok ? 'EXISTS ✅' : 'NOT FOUND ❌'} (${response.status})`);
    return response.ok;
  } catch (error) {
    console.error(`Error checking route ${route}:`, error);
    return false;
  }
}

// Check for tenant context
function checkTenantContext() {
  if (window.tenantContext) {
    console.log(`Tenant Context: ${window.tenantContext.currentTenantId || 'Not set'} ✅`);
  } else {
    console.log('Tenant Context: Not found in window object ❌');
  }
  
  // Try to find tenant info in localStorage
  const tenantInfo = localStorage.getItem('tenantInfo');
  if (tenantInfo) {
    console.log(`Tenant Info in localStorage: ${tenantInfo} ✅`);
  } else {
    console.log('Tenant Info: Not found in localStorage ❌');
  }
}

// Check for CSS loading
function checkCssLoading() {
  const styleSheets = document.styleSheets;
  console.log(`StyleSheets loaded: ${styleSheets.length}`);
  
  for (let i = 0; i < styleSheets.length; i++) {
    try {
      const sheet = styleSheets[i];
      console.log(`StyleSheet ${i+1}: ${sheet.href || 'Inline styles'}`);
    } catch (e) {
      console.log(`StyleSheet ${i+1}: Error accessing (likely CORS issue)`);
    }
  }
}

// Check for JavaScript errors
function checkJsErrors() {
  const originalConsoleError = console.error;
  let errors = [];
  
  console.error = function() {
    errors.push(Array.from(arguments).join(' '));
    originalConsoleError.apply(console, arguments);
  };
  
  setTimeout(() => {
    console.error = originalConsoleError;
    console.log(`JavaScript Errors detected: ${errors.length}`);
    if (errors.length > 0) {
      console.log('Error summary:');
      errors.forEach((err, i) => console.log(`${i+1}. ${err}`));
    }
  }, 5000);
}

// Check for network requests
function checkNetworkRequests() {
  const originalFetch = window.fetch;
  let requests = [];
  
  window.fetch = function() {
    requests.push(arguments[0]);
    return originalFetch.apply(this, arguments);
  };
  
  setTimeout(() => {
    window.fetch = originalFetch;
    console.log(`Network requests detected: ${requests.length}`);
    if (requests.length > 0) {
      console.log('Request summary:');
      requests.forEach((req, i) => console.log(`${i+1}. ${req}`));
    }
  }, 5000);
}

// Run all checks
async function runAllChecks() {
  console.log("=== ROUTE VERIFICATION ===");
  for (const route of routesToCheck) {
    await checkRoute(route);
  }
  
  console.log("\n=== TENANT CONTEXT VERIFICATION ===");
  checkTenantContext();
  
  console.log("\n=== CSS VERIFICATION ===");
  checkCssLoading();
  
  console.log("\n=== JAVASCRIPT ERROR VERIFICATION ===");
  checkJsErrors();
  
  console.log("\n=== NETWORK REQUEST VERIFICATION ===");
  checkNetworkRequests();
  
  console.log("\n=== VERIFICATION COMPLETE ===");
  console.log("Please copy all output and share it for analysis");
}

// Start verification
runAllChecks();
```

Copy and paste this entire script into your browser console while on edpsychconnect.com, then share the output for analysis.
