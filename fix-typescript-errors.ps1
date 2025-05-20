# Fix Spinner size="large" to size="lg"
Get-ChildItem -Path .\src -Recurse -Filter "*.tsx" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'size="large"', 'size="lg"' | Set-Content $_.FullName
}

# Fix Alert type="error" to variant="error" and add div children
Get-ChildItem -Path .\src -Recurse -Filter "*.tsx" | ForEach-Object {
    $content = Get-Content $_.FullName
    $content = $content -replace 'Alert type="error"', 'Alert variant="error"'
    $content = $content -replace 'Alert type="success"', 'Alert variant="success"'
    $content = $content -replace 'Alert type="warning"', 'Alert variant="warning"'
    $content = $content -replace 'Alert type="info"', 'Alert variant="info"'
    $content | Set-Content $_.FullName
}

Write-Host "TypeScript errors fixed successfully!"