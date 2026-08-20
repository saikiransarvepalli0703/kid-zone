# Build script to compile Java code and package WAR file
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host " Compiling Java Backend & Packaging WAR Artifact" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

$baseDir = "c:\Users\User\Desktop\kid zone"
$targetClasses = "$baseDir\target\classes"
$targetDir = "$baseDir\target"

if (-not (Test-Path $targetClasses)) {
    New-Item -ItemType Directory -Path $targetClasses -Force | Out-Null
}

# Collect Java source files
$javaFiles = Get-ChildItem -Path "$baseDir\src\main\java" -Filter "*.java" -Recurse | Select-Object -ExpandProperty FullName

Write-Host "Compiling $($javaFiles.Count) Java files..." -ForegroundColor Yellow
& javac -d $targetClasses -sourcepath "$baseDir\src\main\java" $javaFiles

if ($LASTEXITCODE -eq 0) {
    Write-Host "Java compilation SUCCESS!" -ForegroundColor Green
    
    # Create WAR archive structure
    $warDir = "$targetDir\war_temp"
    if (Test-Path $warDir) { Remove-Item -Path $warDir -Recurse -Force }
    
    New-Item -ItemType Directory -Path "$warDir\WEB-INF\classes" -Force | Out-Null
    Copy-Item -Path "$targetClasses\*" -Destination "$warDir\WEB-INF\classes" -Recurse -Force
    Copy-Item -Path "$baseDir\src\main\webapp\WEB-INF\web.xml" -Destination "$warDir\WEB-INF\web.xml" -Force
    Copy-Item -Path "$baseDir\index.html" -Destination "$warDir\index.html" -Force
    Copy-Item -Path "$baseDir\css" -Destination "$warDir\css" -Recurse -Force
    Copy-Item -Path "$baseDir\js" -Destination "$warDir\js" -Recurse -Force

    $warFile = "$targetDir\calculator-1.0.war"
    if (Test-Path $warFile) { Remove-Item $warFile }

    # Zip into .war file using System.IO.Compression
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory($warDir, $warFile)
    
    Write-Host "Artifact WAR packaged successfully at: $warFile" -ForegroundColor Green
} else {
    Write-Host "Java Compilation Failed" -ForegroundColor Red
}
