# GitHub Credentials for EdPsych AI Education Platform

## Repository Information
- Repository URL: https://github.com/DrSI-P/EdPsych-AI-Education-Platform.git
- Branch: complete-rebuild

## Access Credentials
- GitHub PAT: [REDACTED - Store in environment variables]
- Workflow Access Token: [REDACTED - Store in environment variables]

## Stripe API Keys
- Publishable Key: [REDACTED - Store in environment variables]
- Secret Key: [REDACTED - Store in environment variables]
- Test Secret Key: [REDACTED - Store in environment variables]

## Webhook Information
- Destination ID: [REDACTED - Store in environment variables]
- Workbench URL: https://dashboard.stripe.com/acct_[REDACTED]/workbench/webhooks/[REDACTED]
- Webhook Signing Secret: [REDACTED - Store in environment variables]

## HEYGEN API Information
- API Key: [REDACTED - Store in environment variables]
- API URL: https://api.heygen.com

## Environment Variables Setup
```
# GitHub
GITHUB_PAT=your_github_pat_here
GITHUB_WORKFLOW_TOKEN=your_workflow_token_here

# Stripe
STRIPE_PUBLISHABLE_KEY=your_publishable_key_here
STRIPE_SECRET_KEY=your_secret_key_here
STRIPE_TEST_SECRET_KEY=your_test_secret_key_here
STRIPE_WEBHOOK_SECRET=your_webhook_secret_here

# HEYGEN
HEYGEN_API_KEY=your_heygen_api_key_here
HEYGEN_API_URL=https://api.heygen.com
```

## Implementation Progress Tracking
- All strategic planning documents have been committed and pushed to GitHub
- Implementation will proceed in modular, incremental steps with regular commits
- Video assets will be integrated at strategic locations as provided by the user
- Final implementation will maintain high standards established in planning phase

## Note on Sandbox Limitations
To mitigate sandbox limitations and prevent loss of progress:
1. Implement features in small, self-contained modules
2. Commit and push changes frequently to GitHub
3. Document implementation progress in this file
4. Use feature flags to enable/disable partially completed features
5. Maintain clear separation of concerns for easier resumption if interrupted

## Security Best Practices
- Never store API keys, tokens, or other secrets in the repository
- Use environment variables for all sensitive information
- Use .env.local for local development (added to .gitignore)
- For production, use secure environment variable storage in deployment platform
- Regularly rotate credentials and update environment variables
