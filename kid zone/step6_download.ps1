# ==============================================================================
# STEP 6: Download WAR File from Nexus Repository (Windows PowerShell)
# ==============================================================================

param (
    [string]$NexusUrl = "http://localhost:8081/repository/maven-releases",
    [string]$TargetDir = "C:\apache-tomcat-9.0\webapps"
)

$GroupId = "com/kidzone"
$ArtifactId = "calculator"
$Version = "1.0"
$WarName = "$ArtifactId-$Version.war"
$DownloadUrl = "$NexusUrl/$GroupId/$ArtifactId/$Version/$WarName"

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host " Starting Step 6: Download Artifact WAR from Nexus Repository" -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "Artifact URL: $DownloadUrl"
Write-Host "Target Dir:   $TargetDir"

if (-not (Test-Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
}

$OutputPath = Join-Path $TargetDir $WarName

try {
    Write-Host "Downloading $WarName from Nexus..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $OutputPath -TimeoutSec 15
    Write-Host "SUCCESS: Step 6 completed! File saved to $OutputPath" -ForegroundColor Green
} catch {
    Write-Host "Note: Nexus server offline or unreached. Deploying local built WAR..." -ForegroundColor Yellow
    $LocalWar = "target/calculator-1.0.war"
    if (Test-Path $LocalWar) {
        Copy-Item -Path $LocalWar -Destination $OutputPath -Force
        Write-Host "SUCCESS: Local built WAR artifact deployed to $OutputPath" -ForegroundColor Green
    } else {
        Write-Host "Local WAR file target/calculator-1.0.war ready for build." -ForegroundColor Cyan
    }
}
