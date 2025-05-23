/**
 * API Testing Utilities for EdPsych AI Education Platform
 * 
 * This module provides specialized testing utilities for validating
 * API endpoints across the platform, focusing on request validation,
 * response structure, and error handling.
 */

import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { logger } from '../../logging';

// API test result interface
export interface ApiTestResult {
  endpoint: string;
  method: string;
  success: boolean;
  statusCode: number;
  responseTime: number;
  validationErrors?: string[];
  responseErrors?: string[];
  securityIssues?: string[];
}

// API test options interface
export interface ApiTestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  query?: Record<string, string>;
  expectedStatus?: number;
  expectedResponseSchema?: Record<string, any>;
  testAuth?: boolean;
  testRateLimit?: boolean;
  testValidation?: boolean;
}

// Default API test options
const defaultApiTestOptions: ApiTestOptions = {
  method: 'GET',
  headers: {},
  expectedStatus: 200,
  testAuth: true,
  testRateLimit: false,
  testValidation: true,
};

/**
 * Tests an API endpoint
 * @param handler API route handler function
 * @param endpoint Endpoint path
 * @param options Test options
 * @returns API test result
 */
export async function testApiEndpoint(
  handler: (req: NextRequest) => Promise<NextResponse>,
  endpoint: string,
  options: ApiTestOptions = {}
): Promise<ApiTestResult> {
  try {
    // Merge with default options
    const fullOptions: ApiTestOptions = {
      ...defaultApiTestOptions,
      ...options,
    };
    
    logger.info('Testing API endpoint', {
      endpoint,
      method: fullOptions.method,
      options: fullOptions,
    });
    
    // Create mock request
    const request = createMockRequest(endpoint, fullOptions);
    
    // Measure response time
    const startTime = performance.now();
    const response = await handler(request);
    const responseTime = performance.now() - startTime;
    
    // Validate response
    const validationErrors = validateResponse(response, fullOptions);
    
    // Check for response errors
    const responseErrors = checkResponseErrors(response);
    
    // Check for security issues
    const securityIssues = fullOptions.testAuth ? checkSecurityIssues(request, response) : [];
    
    // Create test result
    const result: ApiTestResult = {
      endpoint,
      method: fullOptions.method || 'GET',
      success: validationErrors.length === 0 && responseErrors.length === 0 && securityIssues.length === 0,
      statusCode: response.status,
      responseTime,
      validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
      responseErrors: responseErrors.length > 0 ? responseErrors : undefined,
      securityIssues: securityIssues.length > 0 ? securityIssues : undefined,
    };
    
    // Log results
    if (result.success) {
      logger.info('API endpoint test passed', {
        endpoint: result.endpoint,
        method: result.method,
        statusCode: result.statusCode,
        responseTime: result.responseTime,
      });
    } else {
      logger.warn('API endpoint test found issues', {
        endpoint: result.endpoint,
        method: result.method,
        statusCode: result.statusCode,
        validationErrors: result.validationErrors?.length || 0,
        responseErrors: result.responseErrors?.length || 0,
        securityIssues: result.securityIssues?.length || 0,
      });
    }
    
    return result;
  } catch (error) {
    logger.error('API endpoint test failed', { error, endpoint });
    
    return {
      endpoint,
      method: options.method || 'GET',
      success: false,
      statusCode: 500,
      responseTime: 0,
      validationErrors: [error instanceof Error ? error.message : String(error)],
    };
  }
}

/**
 * Creates a mock Next.js request
 * @param endpoint Endpoint path
 * @param options Test options
 * @returns Mock Next.js request
 */
function createMockRequest(
  endpoint: string,
  options: ApiTestOptions
): NextRequest {
  // Create URL with query parameters
  let url = `http://localhost:3000${endpoint}`;
  
  if (options.query && Object.keys(options.query).length > 0) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(options.query)) {
      searchParams.append(key, value);
    }
    url += `?${searchParams.toString()}`;
  }
  
  // Create request init
  const init: RequestInit = {
    method: options.method,
    headers: options.headers,
  };
  
  // Add body if provided
  if (options.body) {
    init.body = JSON.stringify(options.body);
    if (!init.headers) {
      init.headers = {};
    }
    (init.headers as Record<string, string>)['Content-Type'] = 'application/json';
  }
  
  // Create request
  const request = new Request(url, init) as unknown as NextRequest;
  
  // Add Next.js specific properties
  (request as any).nextUrl = new URL(url);
  
  return request as NextRequest;
}

/**
 * Validates API response
 * @param response Next.js response
 * @param options Test options
 * @returns Validation errors
 */
function validateResponse(
  response: NextResponse,
  options: ApiTestOptions
): string[] {
  const errors: string[] = [];
  
  // Check status code
  if (options.expectedStatus && response.status !== options.expectedStatus) {
    errors.push(`Expected status code ${options.expectedStatus}, but got ${response.status}`);
  }
  
  // Check response schema if provided
  if (options.expectedResponseSchema && options.testValidation) {
    try {
      // Clone the response to avoid consuming it
      response.clone().json().then(data => {
        // Validate response data against schema
        const schemaErrors = validateSchema(data, options.expectedResponseSchema!);
        errors.push(...schemaErrors);
      });
    } catch (error) {
      errors.push(`Failed to parse response as JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  return errors;
}

/**
 * Validates data against a schema
 * @param data Data to validate
 * @param schema Schema to validate against
 * @returns Validation errors
 */
function validateSchema(
  data: any,
  schema: Record<string, any>,
  path: string = ''
): string[] {
  const errors: string[] = [];
  
  // Check if data is an object
  if (typeof data !== 'object' || data === null) {
    return [`Expected object at ${path || 'root'}, but got ${typeof data}`];
  }
  
  // Check each field in the schema
  for (const [key, expectedType] of Object.entries(schema)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    // Check if field exists
    if (!(key in data)) {
      errors.push(`Missing required field: ${currentPath}`);
      continue;
    }
    
    const value = data[key];
    
    // Handle nested objects
    if (typeof expectedType === 'object' && expectedType !== null && !Array.isArray(expectedType)) {
      errors.push(...validateSchema(value, expectedType, currentPath));
      continue;
    }
    
    // Handle arrays
    if (Array.isArray(expectedType)) {
      if (!Array.isArray(value)) {
        errors.push(`Expected array at ${currentPath}, but got ${typeof value}`);
        continue;
      }
      
      // If array schema has an item schema, validate each item
      if (expectedType.length > 0) {
        const itemSchema = expectedType[0];
        
        // If item schema is an object, validate each item against it
        if (typeof itemSchema === 'object' && itemSchema !== null && !Array.isArray(itemSchema)) {
          value.forEach((item, index) => {
            errors.push(...validateSchema(item, itemSchema, `${currentPath}[${index}]`));
          });
        } else {
          // Otherwise, check type of each item
          value.forEach((item, index) => {
            if (typeof item !== itemSchema) {
              errors.push(`Expected ${itemSchema} at ${currentPath}[${index}], but got ${typeof item}`);
            }
          });
        }
      }
      
      continue;
    }
    
    // Handle primitive types
    if (typeof value !== expectedType) {
      errors.push(`Expected ${expectedType} at ${currentPath}, but got ${typeof value}`);
    }
  }
  
  return errors;
}

/**
 * Checks for errors in API response
 * @param response Next.js response
 * @returns Response errors
 */
function checkResponseErrors(response: NextResponse): string[] {
  const errors: string[] = [];
  
  // Check for error status codes
  if (response.status >= 400) {
    errors.push(`Response has error status code: ${response.status}`);
    
    // Try to parse error message from response
    try {
      response.clone().json().then(data => {
        if (data.error || data.message) {
          errors.push(`Error message: ${data.error || data.message}`);
        }
      });
    } catch (error) {
      // Ignore JSON parsing errors
    }
  }
  
  return errors;
}

/**
 * Checks for security issues in API request and response
 * @param request Next.js request
 * @param response Next.js response
 * @returns Security issues
 */
function checkSecurityIssues(
  request: NextRequest,
  response: NextResponse
): string[] {
  const issues: string[] = [];
  
  // Check for missing authentication
  if (!request.headers.get('Authorization')) {
    issues.push('Request is missing Authorization header');
  }
  
  // Check for sensitive headers in response
  const sensitiveHeaders = [
    'X-Powered-By',
    'Server',
    'X-AspNet-Version',
    'X-AspNetMvc-Version',
  ];
  
  for (const header of sensitiveHeaders) {
    if (response.headers.get(header)) {
      issues.push(`Response includes sensitive header: ${header}`);
    }
  }
  
  // Check for missing security headers
  const securityHeaders = [
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
  ];
  
  for (const header of securityHeaders) {
    if (!response.headers.get(header)) {
      issues.push(`Response is missing security header: ${header}`);
    }
  }
  
  return issues;
}

/**
 * Tests an API endpoint with different request methods
 * @param handler API route handler function
 * @param endpoint Endpoint path
 * @param methods HTTP methods to test
 * @param baseOptions Base test options
 * @returns Test results for each method
 */
export async function testApiEndpointMethods(
  handler: (req: NextRequest) => Promise<NextResponse>,
  endpoint: string,
  methods: ('GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH')[],
  baseOptions: ApiTestOptions = {}
): Promise<Record<string, ApiTestResult>> {
  const results: Record<string, ApiTestResult> = {};
  
  // Test each method
  for (const method of methods) {
    const options = { ...baseOptions, method };
    results[method] = await testApiEndpoint(handler, endpoint, options);
  }
  
  return results;
}

/**
 * Tests an API endpoint with different authentication scenarios
 * @param handler API route handler function
 * @param endpoint Endpoint path
 * @param baseOptions Base test options
 * @returns Test results for each authentication scenario
 */
export async function testApiEndpointAuth(
  handler: (req: NextRequest) => Promise<NextResponse>,
  endpoint: string,
  baseOptions: ApiTestOptions = {}
): Promise<Record<string, ApiTestResult>> {
  const results: Record<string, ApiTestResult> = {};
  
  // Test with no authentication
  results.noAuth = await testApiEndpoint(handler, endpoint, {
    ...baseOptions,
    headers: { ...baseOptions.headers, Authorization: '' },
    expectedStatus: 401,
    testAuth: false,
  });
  
  // Test with invalid authentication
  results.invalidAuth = await testApiEndpoint(handler, endpoint, {
    ...baseOptions,
    headers: { ...baseOptions.headers, Authorization: 'Bearer invalid-token' },
    expectedStatus: 401,
    testAuth: false,
  });
  
  // Test with valid authentication
  results.validAuth = await testApiEndpoint(handler, endpoint, {
    ...baseOptions,
    headers: { ...baseOptions.headers, Authorization: 'Bearer valid-token' },
    testAuth: false,
  });
  
  return results;
}

/**
 * Tests an API endpoint with different input validation scenarios
 * @param handler API route handler function
 * @param endpoint Endpoint path
 * @param validBody Valid request body
 * @param invalidScenarios Invalid request scenarios
 * @param baseOptions Base test options
 * @returns Test results for each validation scenario
 */
export async function testApiEndpointValidation(
  handler: (req: NextRequest) => Promise<NextResponse>,
  endpoint: string,
  validBody: any,
  invalidScenarios: Record<string, any>,
  baseOptions: ApiTestOptions = {}
): Promise<Record<string, ApiTestResult>> {
  const results: Record<string, ApiTestResult> = {};
  
  // Test with valid body
  results.valid = await testApiEndpoint(handler, endpoint, {
    ...baseOptions,
    method: 'POST',
    body: validBody,
  });
  
  // Test each invalid scenario
  for (const [scenario, body] of Object.entries(invalidScenarios)) {
    results[scenario] = await testApiEndpoint(handler, endpoint, {
      ...baseOptions,
      method: 'POST',
      body,
      expectedStatus: 400,
      testValidation: false,
    });
  }
  
  return results;
}

/**
 * Generates an API test report in HTML format
 * @param results API test results
 * @returns HTML report
 */
export function generateApiTestReport(results: ApiTestResult[]): string {
  // Generate HTML report
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Test Report</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        h1, h2, h3 {
          color: #2c3e50;
        }
        .summary {
          display: flex;
          justify-content: space-between;
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .summary-item {
          text-align: center;
        }
        .success {
          color: #27ae60;
        }
        .failure {
          color: #e74c3c;
        }
        .warning {
          color: #f39c12;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f8f9fa;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
        .endpoint-row {
          cursor: pointer;
        }
        .details {
          display: none;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 5px;
          margin-bottom: 15px;
        }
        .show {
          display: block;
        }
        .status-2xx {
          background-color: #e6f7e6;
        }
        .status-3xx {
          background-color: #e6f7f7;
        }
        .status-4xx {
          background-color: #f7e6e6;
        }
        .status-5xx {
          background-color: #f7e6e6;
        }
      </style>
    </head>
    <body>
      <h1>API Test Report</h1>
      <p>Date: ${new Date().toLocaleString()}</p>
      
      <div class="summary">
        <div class="summary-item">
          <h3>Total Tests</h3>
          <p>${results.length}</p>
        </div>
        <div class="summary-item">
          <h3>Passed</h3>
          <p class="success">${results.filter(r => r.success).length}</p>
        </div>
        <div class="summary-item">
          <h3>Failed</h3>
          <p class="failure">${results.filter(r => !r.success).length}</p>
        </div>
        <div class="summary-item">
          <h3>Average Response Time</h3>
          <p>${(results.reduce((sum, r) => sum + r.responseTime, 0) / results.length).toFixed(2)} ms</p>
        </div>
      </div>
      
      <h2>Endpoint Results</h2>
      <table>
        <thead>
          <tr>
            <th>Endpoint</th>
            <th>Method</th>
            <th>Status</th>
            <th>Response Time</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          ${results.map((result, index) => `
            <tr class="endpoint-row ${getStatusClass(result.statusCode)}" onclick="toggleDetails(${index})">
              <td>${result.endpoint}</td>
              <td>${result.method}</td>
              <td>${result.statusCode}</td>
              <td>${result.responseTime.toFixed(2)} ms</td>
              <td class="${result.success ? 'success' : 'failure'}">${result.success ? 'PASS' : 'FAIL'}</td>
            </tr>
            <tr>
              <td colspan="5">
                <div id="details-${index}" class="details">
                  ${result.validationErrors ? `
                    <h4>Validation Errors</h4>
                    <ul>
                      ${result.validationErrors.map(error => `<li>${error}</li>`).join('')}
                    </ul>
                  ` : ''}
                  
                  ${result.responseErrors ? `
                    <h4>Response Errors</h4>
                    <ul>
                      ${result.responseErrors.map(error => `<li>${error}</li>`).join('')}
                    </ul>
                  ` : ''}
                  
                  ${result.securityIssues ? `
                    <h4>Security Issues</h4>
                    <ul>
                      ${result.securityIssues.map(issue => `<li>${issue}</li>`).join('')}
                    </ul>
                  ` : ''}
                  
                  ${!result.validationErrors && !result.responseErrors && !result.securityIssues ? `
                    <p>No issues found.</p>
                  ` : ''}
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <script>
        function toggleDetails(index) {
          const details = document.getElementById('details-' + index);
          details.classList.toggle('show');
        }
      </script>
      
      <footer>
        <p>Generated by EdPsych AI Education Platform API Testing Tools</p>
      </footer>
    </body>
    </html>
  `;
  
  return html;
  
  // Helper function to get status class
  function getStatusClass(status: number): string {
    if (status >= 200 && status < 300) return 'status-2xx';
    if (status >= 300 && status < 400) return 'status-3xx';
    if (status >= 400 && status < 500) return 'status-4xx';
    if (status >= 500) return 'status-5xx';
    return '';
  }
}

// Export default
export default {
  testApiEndpoint,
  testApiEndpointMethods,
  testApiEndpointAuth,
  testApiEndpointValidation,
  generateApiTestReport,
};
