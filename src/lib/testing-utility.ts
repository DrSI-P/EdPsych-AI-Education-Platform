// Testing and Error Logging Utility for EdPsych AI Education Platform
// This utility helps with systematic testing and error documentation

import fs from 'fs';
import path from 'path';

// Define test result interface
interface TestResult {
  component: string;
  feature: string;
  status: 'passed' | 'failed';
  browser?: string;
  device?: string;
  errorMessage?: string;
  steps?: string[];
  timestamp: string;
}

// Define test report interface
interface TestReport {
  summary: {
    total: number;
    passed: number;
    failed: number;
    date: string;
  };
  results: TestResult[];
}

class TestingUtility {
  private reportPath: string;
  private report: TestReport;

  constructor(reportPath: string = './testing-report.json') {
    this.reportPath = reportPath;
    
    // Initialize or load existing report
    if (fs.existsSync(reportPath)) {
      this.report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    } else {
      this.report = {
        summary: {
          total: 0,
          passed: 0,
          failed: 0,
          date: new Date().toISOString()
        },
        results: []
      };
    }
  }

  // Add a test result
  addResult(result: Omit<TestResult, 'timestamp'>): void {
    const testResult: TestResult = {
      ...result,
      timestamp: new Date().toISOString()
    };

    this.report.results.push(testResult);
    this.report.summary.total++;
    
    if (result.status === 'passed') {
      this.report.summary.passed++;
    } else {
      this.report.summary.failed++;
    }

    this.saveReport();
  }

  // Save the report to file
  saveReport(): void {
    fs.writeFileSync(this.reportPath, JSON.stringify(this.report, null, 2));
  }

  // Get a summary of the test results
  getSummary(): string {
    const { total, passed, failed } = this.report.summary;
    return `
Test Summary:
Total Tests: ${total}
Passed: ${passed}
Failed: ${failed}
Pass Rate: ${total > 0 ? Math.round((passed / total) * 100) : 0}%
    `;
  }

  // Get failed tests for debugging
  getFailedTests(): TestResult[] {
    return this.report.results.filter(result => result.status === 'failed');
  }

  // Clear the report
  clearReport(): void {
    this.report = {
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        date: new Date().toISOString()
      },
      results: []
    };
    this.saveReport();
  }
}

export default TestingUtility;
