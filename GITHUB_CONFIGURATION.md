# GitHub Configuration for EdPsych-AI-Education-Platform

This document outlines the GitHub configuration for the EdPsych-AI-Education-Platform repository.

## Overview

The repository is configured with various GitHub features to ensure code quality, streamline development workflows, and integrate with Vercel for deployment.

## Branch Protection

Branch protection rules are defined in `.github/branch-protection.yml` and should be configured in the GitHub repository settings:

- **Main Branch Protection**:
  - Requires pull request reviews before merging
  - Requires status checks to pass before merging
  - Enforces a linear commit history
  - Prevents force pushes and deletions

- **Staging Branch Protection**:
  - Similar protections as the main branch but with fewer restrictions

## GitHub Actions Workflows

### CI/CD Pipeline

The repository includes GitHub Actions workflows for continuous integration and deployment:

- **CI Workflow** (`.github/workflows/ci.yml`):
  - Runs linting and testing on all pushes and pull requests
  - Builds the application to ensure it compiles correctly
  - Caches dependencies for faster builds

- **Vercel Deployment Workflow** (`.github/workflows/vercel-deploy.yml`):
  - Automatically deploys to Vercel preview environments for pull requests
  - Deploys to staging for the staging branch
  - Deploys to production for the main branch
  - Runs database migrations after production deployment
  - Comments on pull requests with preview URLs

### Required Secrets

The following secrets need to be configured in the GitHub repository settings:

- `VERCEL_TOKEN`: API token for Vercel
- `VERCEL_ORG_ID`: Organization ID from Vercel
- `VERCEL_PROJECT_ID`: Project ID from Vercel
- `PROD_DATABASE_URL`: Production database connection string

## Issue and Pull Request Templates

The repository includes templates to standardize issue and pull request creation:

- **Issue Templates**:
  - Bug Report (`.github/ISSUE_TEMPLATE/bug_report.md`)
  - Feature Request (`.github/ISSUE_TEMPLATE/feature_request.md`)

- **Pull Request Template** (`.github/pull_request_template.md`):
  - Standardizes pull request descriptions
  - Includes checklists for code quality and testing
  - Prompts for educational impact considerations

## Dependabot Configuration

Dependabot is configured in `.github/dependabot.yml` to automatically update dependencies:

- **NPM Dependencies**:
  - Checks for updates weekly
  - Groups development and production dependencies
  - Limits the number of open pull requests

- **GitHub Actions**:
  - Checks for updates weekly
  - Ensures workflows use the latest action versions

- **Docker**:
  - Checks for updates monthly
  - Keeps Docker base images up to date

## Code Ownership

The CODEOWNERS file (`.github/CODEOWNERS`) defines ownership for different parts of the codebase:

- Assigns specific teams or individuals to different areas of the code
- Ensures the right people are automatically requested for review
- Helps maintain code quality and knowledge sharing

## Integration with Vercel

The GitHub configuration is designed to work seamlessly with Vercel:

- Automatic preview deployments for pull requests
- Production deployments from the main branch
- Environment variable handling between GitHub and Vercel
- Database migration automation

## Setting Up GitHub Repository

1. Create a new repository on GitHub
2. Push the initial code to the repository
3. Configure branch protection rules in the repository settings
4. Add the required secrets for GitHub Actions
5. Enable Dependabot in the repository settings
6. Connect the repository to Vercel

## Best Practices

- Always create a pull request for changes, even for small fixes
- Use the issue templates when reporting bugs or requesting features
- Wait for CI checks to pass before merging pull requests
- Keep the main branch deployable at all times
- Use semantic versioning for releases
- Tag releases in GitHub for better version tracking