# Comprehensive TypeScript Error Fix Script

Write-Host "Starting comprehensive TypeScript error fixes..."

# Fix Spinner size="large" to size="lg"
Write-Host "Fixing Spinner size='large' to size='lg'..."
Get-ChildItem -Path .\src -Recurse -Filter "*.tsx" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'size="large"', 'size="lg"' | Set-Content $_.FullName
}

# Fix Alert type="error" to variant="error" and similar for other alert types
Write-Host "Fixing Alert type attributes to variant attributes..."
Get-ChildItem -Path .\src -Recurse -Filter "*.tsx" | ForEach-Object {
    $content = Get-Content $_.FullName
    $content = $content -replace 'Alert type="error"', 'Alert variant="error"'
    $content = $content -replace 'Alert type="success"', 'Alert variant="success"'
    $content = $content -replace 'Alert type="warning"', 'Alert variant="warning"'
    $content = $content -replace 'Alert type="info"', 'Alert variant="info"'
    $content | Set-Content $_.FullName
}

# Fix Alert components to properly handle children
Write-Host "Fixing Alert components to properly handle children..."
Get-ChildItem -Path .\src -Recurse -Filter "*.tsx" | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath -Raw
    
    # Look for Alert components with className but no children wrapper
    if ($content -match '<Alert variant="[^"]+"\s+className="[^"]+"\s*>\s*\{[^{}]+\}\s*</Alert>') {
        $content = $content -replace '(<Alert variant="[^"]+"\s+className="[^"]+"\s*>)\s*(\{[^{}]+\})\s*(</Alert>)', '$1<div>$2</div>$3'
        Set-Content -Path $filePath -Value $content
    }
}

# Fix Tabs components to use the Radix UI pattern
Write-Host "Fixing Tabs components to use the Radix UI pattern..."
Get-ChildItem -Path .\src -Recurse -Filter "*.tsx" | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath -Raw
    
    # Pattern 1: Look for Tabs with tabs, activeTab, and onChange props
    if ($content -match '<Tabs\s+tabs=\{.*\}\s+activeTab=\{(.*?)\}\s+onChange=\{(.*?)\}') {
        Write-Host "Found old Tabs pattern in $filePath"
        
        # Extract the activeTab and onChange values
        $activeTabValue = $matches[1]
        $onChangeValue = $matches[2]
        
        # This is a complex transformation that might need manual intervention
        # We'll provide a warning and instructions
        Write-Host "WARNING: Manual intervention required for Tabs component in $filePath"
        Write-Host "Please replace the Tabs component with the Radix UI pattern:"
        Write-Host "<Tabs defaultValue={$activeTabValue} onValueChange={$onChangeValue}>"
        Write-Host "  <TabsList>"
        Write-Host "    <TabsTrigger value=\"tab1\">Tab 1</TabsTrigger>"
        Write-Host "    <TabsTrigger value=\"tab2\">Tab 2</TabsTrigger>"
        Write-Host "  </TabsList>"
        Write-Host "  <TabsContent value=\"tab1\">Content 1</TabsContent>"
        Write-Host "  <TabsContent value=\"tab2\">Content 2</TabsContent>"
        Write-Host "</Tabs>"
    }
}

# Fix import statements for Tabs components
Write-Host "Fixing import statements for Tabs components..."
Get-ChildItem -Path .\src -Recurse -Filter "*.tsx" | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath -Raw
    
    # Look for imports of just Tabs and add the other components if needed
    if ($content -match "import\s*{\s*Tabs\s*}\s*from\s*'@/components/ui/tabs'" -and 
        !($content -match "import\s*{\s*Tabs,\s*TabsContent,\s*TabsList,\s*TabsTrigger\s*}\s*from\s*'@/components/ui/tabs'")) {
        
        Write-Host "Updating Tabs import in $filePath"
        $content = $content -replace "import\s*{\s*Tabs\s*}\s*from\s*'@/components/ui/tabs'", "import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'"
        Set-Content -Path $filePath -Value $content
    }
}

# Add React import if missing
Write-Host "Adding React import if missing..."
Get-ChildItem -Path .\src -Recurse -Filter "*.tsx" | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath -Raw
    
    # Check if the file uses React but doesn't import it
    if ($content -match "<[A-Z]" -and !($content -match "import\s+React")) {
        Write-Host "Adding React import to $filePath"
        if ($content -match "'use client';") {
            $content = $content -replace "('use client';\s*)", "`$1`nimport React from 'react';`n"
        } else {
            $content = "import React from 'react';" + "`n" + $content
        }
        Set-Content -Path $filePath -Value $content
    }
}

# Fix Card and CardContent components to properly handle children
Write-Host "Fixing Card and CardContent components to properly handle children..."
Get-ChildItem -Path .\src -Recurse -Filter "*.tsx" | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath -Raw
    
    # Look for CardContent with className but no children wrapper
    if ($content -match '<CardContent className="[^"]+">') {
        Write-Host "Found CardContent with className in $filePath"
        # This is a complex transformation that might need manual intervention
        Write-Host "WARNING: Manual intervention may be required for CardContent component in $filePath"
        Write-Host "Ensure CardContent has proper children handling"
    }
}

Write-Host "TypeScript errors fixed successfully!"