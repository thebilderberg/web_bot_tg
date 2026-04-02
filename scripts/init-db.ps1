param(
  [string]$PostgresBin = "",
  [string]$HostName = "localhost",
  [int]$Port = 5432,
  [string]$SuperUser = "postgres",
  [string]$DbUser = "webbot",
  # Dev-only password; safe for local setup.
  [SecureString]$DbPassword = (ConvertTo-SecureString "webbot_password" -AsPlainText -Force),
  [string]$DbName = "webbot"
)

$ErrorActionPreference = "Stop"

function Resolve-PsqlPath {
  param([string]$PostgresBin)
  if ($PostgresBin -and (Test-Path $PostgresBin)) {
    $psql = Join-Path $PostgresBin "psql.exe"
    if (Test-Path $psql) { return $psql }
  }
  $cmd = Get-Command psql.exe -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  throw "psql.exe not found. Add Postgres bin to PATH or pass -PostgresBin 'C:\Program Files\PostgreSQL\16\bin'"
}

$psql = Resolve-PsqlPath -PostgresBin $PostgresBin
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$initSql = Join-Path $root "db\init\001_init.sql"
if (!(Test-Path $initSql)) { throw "Init SQL not found: $initSql" }

Write-Host "Using psql: $psql"
Write-Host "Host: $HostName  Port: $Port"
Write-Host "DB user: $DbUser  DB: $DbName"

$plainDbPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($DbPassword)
)

# 1) Create role (if missing)
$createRole = @"
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '$DbUser') THEN
    CREATE ROLE $DbUser LOGIN PASSWORD '$plainDbPassword';
  END IF;
END
$$;
"@

& $psql -h $HostName -p $Port -U $SuperUser -d postgres -v ON_ERROR_STOP=1 -c $createRole

# 2) Create DB (if missing)
$createDb = @"
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = '$DbName') THEN
    CREATE DATABASE $DbName OWNER $DbUser;
  END IF;
END
$$;
"@

& $psql -h $HostName -p $Port -U $SuperUser -d postgres -v ON_ERROR_STOP=1 -c $createDb

# 3) Apply schema/init SQL
& $psql -h $HostName -p $Port -U $SuperUser -d $DbName -v ON_ERROR_STOP=1 -f $initSql

Write-Host "Done. DATABASE_URL example:"
Write-Host ("postgres://{0}:{1}@{2}:{3}/{4}" -f $DbUser, $plainDbPassword, $HostName, $Port, $DbName)

