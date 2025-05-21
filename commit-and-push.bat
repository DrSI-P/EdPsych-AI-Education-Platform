@echo off
echo Committing and pushing build fixes to GitHub...

REM Add the modified files
git add src/app/api/curriculum/plans/route.ts
git add src/app/api/curriculum/collaboration/route.ts
git add fix-migrations.js
git add fix-build-issues.js
git add BUILD-FIX-README.md
git add commit-and-push.sh
git add commit-and-push.bat

REM Commit the changes
git commit -m "Fix build issues: type error in plans route and migration failure"

REM Push to GitHub
git push origin main

echo Changes pushed to GitHub successfully!
echo Your Vercel build should now complete without the previous errors.
pause