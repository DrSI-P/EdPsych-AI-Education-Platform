# PowerShell script to fix remaining TypeScript errors

Write-Host "Starting TypeScript error fixes..." -ForegroundColor Green

# 1. Fix Alert components - change type to variant
Write-Host "Fixing Alert components..." -ForegroundColor Cyan
Get-ChildItem -Path "EdPsych-AI-Education-Platform/src" -Recurse -Include "*.tsx", "*.ts" |
    ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $updated = $content -replace '<Alert\s+type="(error|success|warning|info)"', '<Alert variant="$1"'
        
        # Add div wrapper for children if not present
        $updated = $updated -replace '(<Alert\s+variant="[^"]+"\s+[^>]*>)([^<].*?)(<\/Alert>)', '$1<div>$2</div>$3'
        
        if ($updated -ne $content) {
            Set-Content -Path $_.FullName -Value $updated
            Write-Host "  Fixed Alert in $($_.FullName)" -ForegroundColor Yellow
        }
    }

# 2. Fix Spinner components - change size="large" to size="lg"
Write-Host "Fixing Spinner components..." -ForegroundColor Cyan
Get-ChildItem -Path "EdPsych-AI-Education-Platform/src" -Recurse -Include "*.tsx", "*.ts" |
    ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        $updated = $content -replace '<Spinner\s+size="large"', '<Spinner size="lg"'
        
        if ($updated -ne $content) {
            Set-Content -Path $_.FullName -Value $updated
            Write-Host "  Fixed Spinner in $($_.FullName)" -ForegroundColor Yellow
        }
    }

# 3. Fix Tabs components - change to Radix UI pattern
Write-Host "Fixing Tabs components..." -ForegroundColor Cyan
Get-ChildItem -Path "EdPsych-AI-Education-Platform/src" -Recurse -Include "*.tsx", "*.ts" |
    ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        
        # Check if file contains the old Tabs pattern
        if ($content -match '<Tabs\s+tabs=') {
            # Extract the tabs array and activeTab/onChange props
            if ($content -match '<Tabs\s+tabs=\[\s*({[^}]*}(?:,\s*{[^}]*})*)\s*\]\s*activeTab=(\w+)\s*onChange=(\w+)') {
                $tabsArray = $Matches[1]
                $activeTabVar = $Matches[2]
                $onChangeVar = $Matches[3]
                
                # Parse the tabs array to create TabsTrigger components
                $tabsTriggers = ""
                $tabsContent = ""
                
                # Extract each tab object
                $tabMatches = [regex]::Matches($tabsArray, '{([^}]*)}')
                foreach ($match in $tabMatches) {
                    $tabProps = $match.Groups[1].Value
                    
                    # Extract id and label
                    if ($tabProps -match 'id:\s*[''"]([^''"]*)[''"].*label:\s*[''"]([^''"]*)[''"]' -or 
                        $tabProps -match 'id:\s*(\w+).*label:\s*[''"]([^''"]*)[''"]') {
                        $id = $Matches[1]
                        $label = $Matches[2]
                        
                        $tabsTriggers += "<TabsTrigger value=`"$id`">$label</TabsTrigger>`n                "
                        $tabsContent += "<TabsContent value=`"$id`">{$activeTabVar === '$id' && renderContent()}</TabsContent>`n                "
                    }
                }
                
                # Create the new Tabs component
                $newTabsComponent = "<Tabs value={$activeTabVar} onValueChange={$onChangeVar}>`n            <TabsList>`n                $tabsTriggers`n            </TabsList>`n            `n            $tabsContent`n          </Tabs>"
                
                # Replace the old Tabs component with the new one
                $updated = $content -replace '<Tabs\s+tabs=\[\s*({[^}]*}(?:,\s*{[^}]*})*)\s*\]\s*activeTab=\w+\s*onChange=\w+[^>]*>.*?<\/Tabs>', $newTabsComponent
                
                Set-Content -Path $_.FullName -Value $updated
                Write-Host "  Fixed Tabs in $($_.FullName)" -ForegroundColor Yellow
            }
        }
    }

# 4. Fix Card components - add className props
Write-Host "Fixing Card components..." -ForegroundColor Cyan
Get-ChildItem -Path "EdPsych-AI-Education-Platform/src" -Recurse -Include "*.tsx", "*.ts" |
    ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        
        # Add className to Card components if missing
        $updated = $content -replace '<Card>(?!\s*<CardHeader)', '<Card className="w-full">'
        $updated = $updated -replace '<CardHeader>(?!\s*<h)', '<CardHeader className="pb-2">'
        $updated = $updated -replace '<CardContent>(?!\s*{)', '<CardContent className="pt-2">'
        
        if ($updated -ne $content) {
            Set-Content -Path $_.FullName -Value $updated
            Write-Host "  Fixed Card in $($_.FullName)" -ForegroundColor Yellow
        }
    }

# 5. Add React import if missing
Write-Host "Adding React imports where missing..." -ForegroundColor Cyan
Get-ChildItem -Path "EdPsych-AI-Education-Platform/src" -Recurse -Include "*.tsx", "*.ts" |
    ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        
        # Check if file uses JSX but doesn't import React
        if ($content -match '<\w+' -and -not $content -match "import\s+React") {
            $updated = "import React from 'react';" + "`n" + $content
            Set-Content -Path $_.FullName -Value $updated
            Write-Host "  Added React import to $($_.FullName)" -ForegroundColor Yellow
        }
    }

# 6. Update import statements for Tabs components
Write-Host "Updating Tabs import statements..." -ForegroundColor Cyan
Get-ChildItem -Path "EdPsych-AI-Education-Platform/src" -Recurse -Include "*.tsx", "*.ts" |
    ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        
        # Check if file imports Tabs but not TabsList, TabsTrigger, TabsContent
        if ($content -match "import\s+{\s*Tabs\s*}" -and -not $content -match "TabsList") {
            $updated = $content -replace 'import\s+{\s*Tabs\s*}\s+from\s+[''"]@/components/ui/tabs[''"]', 'import { Tabs, TabsList, TabsTrigger, TabsContent } from ''@/components/ui/tabs'''
            
            if ($updated -ne $content) {
                Set-Content -Path $_.FullName -Value $updated
                Write-Host "  Updated Tabs imports in $($_.FullName)" -ForegroundColor Yellow
            }
        }
    }

Write-Host "TypeScript error fixes completed!" -ForegroundColor Green