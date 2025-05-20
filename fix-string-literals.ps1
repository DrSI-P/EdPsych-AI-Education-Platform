# PowerShell script to fix string literal issues in TypeScript files

Write-Host "Starting string literal fixes..." -ForegroundColor Green

# Fix non-standard apostrophes and quotes
Write-Host "Fixing non-standard apostrophes and quotes..." -ForegroundColor Cyan
Get-ChildItem -Path "EdPsych-AI-Education-Platform/src" -Recurse -Include "*.tsx", "*.ts" | ForEach-Object {
    try {
        $content = [string]::Join("`n", (Get-Content -LiteralPath $_.FullName -ErrorAction Stop))
        
        # Replace non-standard apostrophes with standard ones
        $updated = $content -replace "'", "'"
        $updated = $updated -replace "'", "'"
        
        # Replace non-standard quotes with standard ones
        $updated = $updated -replace [char]0x201C, '"'
        $updated = $updated -replace [char]0x201D, '"'
        
        if ($updated -ne $content) {
            Set-Content -LiteralPath $_.FullName -Value $updated
            Write-Host "  Fixed string literals in $($_.FullName)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  Skipping file - Error reading file" -ForegroundColor Gray
    }
}

# Fix unterminated string literals and syntax errors in specific files
Write-Host "Fixing specific syntax errors..." -ForegroundColor Cyan

# Fix ai-avatar-video-service.ts
$filePath = "EdPsych-AI-Education-Platform/src/components/ai-avatar/ai-avatar-video-service.ts"
if (Test-Path $filePath) {
    try {
        $content = [string]::Join("`n", (Get-Content -LiteralPath $filePath -ErrorAction Stop))
        
        # Fix line 115 with the non-standard apostrophe
        $updated = $content -replace "they're implemented", "they're implemented"
        
        if ($updated -ne $content) {
            Set-Content -LiteralPath $filePath -Value $updated
            Write-Host "  Fixed syntax in ai-avatar-video-service.ts" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  Skipping ai-avatar-video-service.ts - Error reading file" -ForegroundColor Gray
    }
}

# Fix avatar-video-integration.tsx
$filePath = "EdPsych-AI-Education-Platform/src/components/avatar/avatar-video-integration.tsx"
if (Test-Path $filePath) {
    try {
        $content = [string]::Join("`n", (Get-Content -LiteralPath $filePath -ErrorAction Stop))
        
        # Fix line 70 with potential syntax errors
        if ($content -match "position === 'feedback' \? '.*?' : undefined") {
            $updated = $content -replace "(position === 'feedback' \? )'.*?'( : undefined)", '$1"Well done on completing this {{subject}} activity! You''ve made great progress with {{skill}}."$2'
            
            if ($updated -ne $content) {
                Set-Content -LiteralPath $filePath -Value $updated
                Write-Host "  Fixed syntax in avatar-video-integration.tsx" -ForegroundColor Yellow
            }
        }
    } catch {
        Write-Host "  Skipping avatar-video-integration.tsx - Error reading file" -ForegroundColor Gray
    }
}

# Fix video-library.tsx
$filePath = "EdPsych-AI-Education-Platform/src/components/avatar/video-library.tsx"
if (Test-Path $filePath) {
    try {
        $content = [string]::Join("`n", (Get-Content -LiteralPath $filePath -ErrorAction Stop))
        
        # Fix line 148 with potential syntax errors
        if ($content -match "content: 'Hello everyone! Today we're going to learn about fractions") {
            $updated = $content -replace "(content: )'Hello everyone! Today we're going to learn about fractions.*?'", '$1"Hello everyone! Today we''re going to learn about fractions. A fraction represents a part of a whole. Imagine you have a pizza cut into 8 equal slices. If you eat 3 slices, you''ve eaten 3/8 of the pizza. The number on the bottom (8) is called the denominator, and it tells us how many equal parts the whole is divided into. The number on the top (3) is called the numerator, and it tells us how many of those parts we''re talking about."'
            
            if ($updated -ne $content) {
                Set-Content -LiteralPath $filePath -Value $updated
                Write-Host "  Fixed syntax in video-library.tsx" -ForegroundColor Yellow
            }
        }
        
        # Fix line 165 with potential syntax errors
        if ($content -match "content: 'Welcome to this professional development session") {
            $updated = $content -replace "(content: )'Welcome to this professional development session.*?'", '$1"Welcome to this professional development session on understanding anxiety in the classroom. Anxiety is one of the most common mental health challenges that students face, and it can significantly impact their learning and wellbeing. In this video, we''ll discuss how to recognize signs of anxiety, strategies to support anxious students, and when to seek additional help from specialists."'
            
            if ($updated -ne $content) {
                Set-Content -LiteralPath $filePath -Value $updated
                Write-Host "  Fixed syntax in video-library.tsx" -ForegroundColor Yellow
            }
        }
        
        # Fix line 182 with potential syntax errors
        if ($content -match "content: 'Hi there! Today we're going to practice") {
            $updated = $content -replace "(content: )'Hi there! Today we're going to practice.*?'", '$1"Hi there! Today we''re going to practice our short vowel sounds. These are the sounds that the vowels a, e, i, o, and u make in words like \"cat,\" \"pet,\" \"sit,\" \"hot,\" and \"sun.\" Let''s start with the short \"a\" sound. Can you say \"a\" as in \"apple\"? Great job! Now, let''s try some words with the short \"a\" sound: cat, hat, map, tap, and bag."'
            
            if ($updated -ne $content) {
                Set-Content -LiteralPath $filePath -Value $updated
                Write-Host "  Fixed syntax in video-library.tsx" -ForegroundColor Yellow
            }
        }
    } catch {
        Write-Host "  Skipping video-library.tsx - Error reading file" -ForegroundColor Gray
    }
}

# Fix feedbackGeneratorService.ts
$filePath = "EdPsych-AI-Education-Platform/src/lib/assessment/feedbackGeneratorService.ts"
if (Test-Path $filePath) {
    try {
        $content = [string]::Join("`n", (Get-Content -LiteralPath $filePath -ErrorAction Stop))
        
        # Fix lines with non-standard apostrophes
        $updated = $content -replace "You've successfully", "You've successfully"
        $updated = $updated -replace "You've demonstrated", "You've demonstrated"
        $updated = $updated -replace "You've broken", "You've broken"
        $updated = $updated -replace "You've evaluated", "You've evaluated"
        $updated = $updated -replace "You've developed", "You've developed"
        
        if ($updated -ne $content) {
            Set-Content -LiteralPath $filePath -Value $updated
            Write-Host "  Fixed syntax in feedbackGeneratorService.ts" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  Skipping feedbackGeneratorService.ts - Error reading file" -ForegroundColor Gray
    }
}

Write-Host "String literal fixes completed!" -ForegroundColor Green