$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir '..')
$apiDir = Join-Path $repoRoot 'apps\api'
$envFile = Join-Path $apiDir '.env'
$backupDir = Join-Path $repoRoot 'backups'

if (-not (Test-Path $envFile)) {
  throw ".env not found at $envFile"
}

$dbUrlLine = Get-Content $envFile | Where-Object { $_ -match '^DATABASE_URL=' } | Select-Object -First 1

if (-not $dbUrlLine) {
  throw "DATABASE_URL not found in $envFile"
}

$dbUrl = $dbUrlLine.Split('=', 2)[1].Trim()

if ([string]::IsNullOrWhiteSpace($dbUrl)) {
  throw "DATABASE_URL is empty"
}

New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

$timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$backupFile = Join-Path $backupDir "postgres_$timestamp.sql"
$tempSchema = "$backupFile.tmp_schema"
$tempData   = "$backupFile.tmp_data"

Write-Host "Backing up database to $backupFile ..."

npx supabase db dump --db-url "$dbUrl" -f "$tempSchema"
if ($LASTEXITCODE -ne 0) {
  Remove-Item $tempSchema -Force -ErrorAction SilentlyContinue
  throw "Schema dump failed"
}

npx supabase db dump --db-url "$dbUrl" --data-only -f "$tempData"
if ($LASTEXITCODE -ne 0) {
  Remove-Item $tempSchema, $tempData -Force -ErrorAction SilentlyContinue
  throw "Data dump failed"
}

# Combine schema + data into a single backup file
Get-Content $tempSchema, $tempData | Set-Content $backupFile -Encoding UTF8
Remove-Item $tempSchema, $tempData -Force

Write-Host "Backup complete: $backupFile"

Get-ChildItem $backupDir -Filter '*.sql' |
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |
  Remove-Item -Force