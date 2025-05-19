# Monitoring and Maintenance Documentation

## Overview

The Monitoring and Maintenance System for the EdPsych-AI-Education-Platform provides comprehensive tools for error tracking, logging, performance monitoring, health checks, and alerting. This system is designed to ensure the platform's reliability, performance, and security in production environments, with special attention to UK educational standards and GDPR compliance.

## Components

### 1. Error Tracking (Sentry)

The error tracking module integrates with Sentry to capture and report errors and exceptions throughout the application.

**Key Features:**
- Privacy-focused error reporting with PII sanitisation
- Environment-specific configuration
- User context tracking with role-based information
- Custom tagging for error categorisation
- Performance transaction tracking

**Integration:**
```typescript
import { sentry } from '@/lib/monitoring';

// Initialize in _app.tsx or similar entry point
sentry.initSentry(process.env.NEXT_PUBLIC_SENTRY_DSN, process.env.NODE_ENV);

// Capture exceptions with context
try {
  // Code that might throw an error
} catch (error) {
  sentry.captureException(error, { 
    userId: user.id,
    action: 'completing_assessment'
  });
}

// Set user context
sentry.setUser(user.id, user.role);
```

### 2. Logging

The logging module provides structured logging with appropriate privacy controls for UK educational settings.

**Key Features:**
- Multiple log levels (error, warn, info, http, debug)
- Environment-specific logging configuration
- Automatic PII sanitisation
- Request and response logging middleware
- File and console transport options

**Integration:**
```typescript
import { logger } from '@/lib/monitoring';

// Log at different levels
logger.logInfo('User completed assessment', { userId: user.id, assessmentId });
logger.logError('Failed to save assessment', error, { userId: user.id });

// Use middleware in API routes
export default function handler(req, res) {
  logger.requestLogger(req, res);
  
  // Handle request
  
  logger.responseLogger(req, res, responseData);
}
```

### 3. Performance Monitoring

The performance monitoring module tracks application performance metrics to identify bottlenecks and optimisation opportunities.

**Key Features:**
- Web Vitals tracking
- API call performance monitoring
- Page load performance tracking
- Resource load performance tracking
- Custom performance measurements

**Integration:**
```typescript
import { performance } from '@/lib/monitoring';

// Track API call performance
const startTime = Date.now();
const response = await fetch('/api/data');
const endTime = Date.now();
performance.trackApiCall('/api/data', 'GET', endTime - startTime, response.status);

// Use performance measurement
const measure = performance.measure('data-processing');
measure.start();
// Process data
const duration = measure.end();
```

### 4. Health Checks

The health checks module provides endpoints and utilities for monitoring system health and availability.

**Key Features:**
- Database connectivity checks
- Memory usage monitoring
- API endpoint availability checks
- Comprehensive health status reporting
- Health check API endpoint

**Integration:**
```typescript
import { healthChecks } from '@/lib/monitoring';

// Perform health check
const healthStatus = await healthChecks.performHealthCheck();

// Check specific components
const dbStatus = await healthChecks.checkDatabase();
const memoryStatus = healthChecks.checkMemoryUsage();
```

### 5. Alerting

The alerting module configures alerts based on monitoring data and sends notifications through various channels.

**Key Features:**
- Configurable alert thresholds
- Multiple notification channels (email, Slack, webhook)
- Alert cooldown periods to prevent notification storms
- Environment-specific alert configuration

**Integration:**
```typescript
import { alerting } from '@/lib/monitoring';

// Register an alert
alerting.registerAlert({
  name: 'high-error-rate',
  description: 'High error rate detected',
  level: 'error',
  threshold: 10, // 10 errors per minute
  cooldown: 5 * 60 * 1000, // 5 minutes
  channels: ['email', 'slack'],
  enabled: true,
});

// Trigger an alert
alerting.triggerAlert('high-error-rate', errorCount, { source: 'api' });
```

## Integration with Application

The monitoring system is integrated with the application through the `MonitoringProvider` component, which should be included near the root of the component tree.

```tsx
// In _app.tsx or similar
import { MonitoringProvider } from '@/components/monitoring-provider';

function MyApp({ Component, pageProps }) {
  return (
    <MonitoringProvider>
      <Component {...pageProps} />
    </MonitoringProvider>
  );
}
```

## Health Check API Endpoint

A health check API endpoint is available at `/api/health` to monitor the system's health status.

```
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-05-19T01:30:00.000Z",
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "database": {
      "status": "healthy",
      "message": "Database connection successful",
      "latency": 15
    },
    "memory": {
      "status": "healthy",
      "message": "Memory usage: 120.45MB / 512.00MB (23.52%)",
      "latency": 2
    }
  }
}
```

## Configuration

The monitoring system can be configured through environment variables:

```
# Sentry configuration
NEXT_PUBLIC_SENTRY_DSN=https://example.ingest.sentry.io/project
NEXT_PUBLIC_ENVIRONMENT=production

# Logging configuration
LOG_LEVEL=info

# Analytics configuration
NEXT_PUBLIC_ANALYTICS_ENABLED=true

# Alerting configuration
ALERT_EMAIL_RECIPIENTS=admin@edpsychconnect.com
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz
ALERT_WEBHOOK_URL=https://alerts.edpsychconnect.com/webhook
```

## Security and Privacy Considerations

The monitoring system is designed with UK educational standards and GDPR compliance in mind:

1. **PII Sanitisation**: Personal identifiable information is automatically redacted from logs and error reports.
2. **Age-Appropriate Controls**: Special handling for data related to users under 18.
3. **Data Minimisation**: Only essential information is collected and stored.
4. **Secure Transmission**: All monitoring data is transmitted securely.
5. **Access Controls**: Monitoring data access is restricted to authorised personnel.

## Testing

The monitoring system includes comprehensive tests to ensure reliability:

```
npm test -- --testPathPattern=src/tests/lib/monitoring
```

## Best Practices

1. **Error Handling**: Always use structured error handling with appropriate context.
2. **Performance Tracking**: Track performance of critical operations and user interactions.
3. **Health Monitoring**: Regularly check the health endpoint to ensure system availability.
4. **Alert Configuration**: Configure alerts with appropriate thresholds to avoid alert fatigue.
5. **Log Levels**: Use appropriate log levels based on the importance of the information.
