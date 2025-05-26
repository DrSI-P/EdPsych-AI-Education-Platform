@echo off
echo Committing and pushing build fixes to GitHub...

REM Add the modified files
git add src/app/api/curriculum/plans/route.ts
git add src/app/api/curriculum/collaboration/route.ts
git add fix-migrations.js
git add fix-build-issues.js
git add BUILD-FIX-README.md
git add UPDATE-BUILD-COMMAND.md
git add package.json
git add commit-and-push.sh
git add commit-and-push.bat
git add .env

REM Commit the changes
git commit -m "Fix build issues: type error in plans route and multiple migration failures"

REM Push to GitHub
git push origin complete-rebuild

echo Changes pushed to GitHub successfully!
echo Your Vercel build should now complete without the previous errors.
pause