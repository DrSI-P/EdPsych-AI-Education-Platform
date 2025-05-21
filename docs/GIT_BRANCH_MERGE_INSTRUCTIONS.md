# Git Branch Merge Instructions

This document provides step-by-step instructions for merging the `master` branch into the `main` branch in the EdPsych-AI-Education-Platform repository, following modern Git best practices.

## Background

In modern Git practices, `main` is the preferred default branch name, while `master` is the legacy name. GitHub and many other platforms have moved away from using `master` as the default branch name. Having both branches can cause confusion and maintenance overhead, so it's recommended to standardise on `main`.

## Prerequisites

Before proceeding with the merge, ensure you have:

1. Git installed on your local machine
2. Proper access permissions to the repository
3. A backup of the repository (just in case)

## Step-by-Step Merge Instructions

### 1. Clone the Repository (if you haven't already)

```bash
git clone https://github.com/DrSI-P/EdPsych-AI-Education-Platform.git
cd EdPsych-AI-Education-Platform
```

### 2. Ensure Your Local Repository is Up to Date

```bash
git fetch --all
```

### 3. Check Out the Master Branch

```bash
git checkout master
git pull origin master
```

### 4. Create the Main Branch (if it doesn't exist)

```bash
git checkout -b main
```

If the `main` branch already exists, you can check it out instead:

```bash
git checkout main
git pull origin main
```

### 5. Merge Master into Main

If you just created the `main` branch, it will already be identical to `master`. If `main` already existed and had different content, merge `master` into it:

```bash
git merge master
```

Resolve any merge conflicts if they occur.

### 6. Push the Main Branch to GitHub

```bash
git push -u origin main
```

### 7. Set Main as the Default Branch on GitHub

1. Go to the repository on GitHub: https://github.com/DrSI-P/EdPsych-AI-Education-Platform
2. Click on "Settings" (near the top right)
3. In the left sidebar, click on "Branches"
4. Under "Default branch", click on the switch button
5. Select "main" from the dropdown
6. Click "Update"
7. Confirm the change when prompted

### 8. Update Local References

After setting `main` as the default branch on GitHub, update your local repository:

```bash
git fetch --all
git remote set-head origin -a
```

### 9. Update CI/CD and Workflow References

If you have any GitHub Actions workflows, CI/CD pipelines, or other automation that references the `master` branch, update those files to reference `main` instead.

Common files to check:
- `.github/workflows/*.yml`
- Any deployment scripts
- Documentation that references the branch name

### 10. Inform Team Members

Let all team members know about the branch change so they can update their local repositories:

```bash
git checkout main
git pull origin main
```

### 11. (Optional) Delete the Master Branch

Once you're confident that everything is working correctly with the `main` branch, you can optionally delete the `master` branch:

On GitHub:
1. Go to the repository on GitHub
2. Click on "Branches"
3. Find the `master` branch and click the trash icon

Locally:
```bash
git branch -d master
git push origin --delete master
```

## Troubleshooting

### Protected Branch Issues

If the `master` branch is protected, you may need to temporarily disable branch protection rules before deleting it:

1. Go to Settings > Branches > Branch protection rules
2. Edit or delete the protection rule for `master`
3. After deleting the branch, create a similar protection rule for `main`

### Local References to Master

If you have local references to `master` in your Git configuration:

```bash
git branch --set-upstream-to=origin/main main
```

## Conclusion

After completing these steps, your repository will use `main` as the default branch, following modern Git best practices. All future development should be based on the `main` branch.

Remember to update any documentation, onboarding materials, or development guides to reference the `main` branch instead of `master`.
