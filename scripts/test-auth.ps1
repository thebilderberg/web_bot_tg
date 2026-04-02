param(
  [string]$BaseUrl = "http://localhost:4000",
  [string]$Login = "user7",
  # Dev-only seed password; safe for local testing.
  [SecureString]$Password = (ConvertTo-SecureString "Test12345!" -AsPlainText -Force)
)

$ErrorActionPreference = "Stop"

$cookies = Join-Path $PSScriptRoot "cookies.txt"
if (Test-Path $cookies) { Remove-Item $cookies -Force }

Write-Host "== Health =="
curl.exe -i "$BaseUrl/health"

Write-Host "`n== Login ($Login) =="
$plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password)
)
curl.exe -i -c $cookies -H "Content-Type: application/json" `
  -d ("{""login"":""$Login"",""password"":""$plainPassword""}") `
  "$BaseUrl/auth/login"

Write-Host "`n== Me =="
curl.exe -i -b $cookies "$BaseUrl/me"

Write-Host "`n== Logout =="
curl.exe -i -b $cookies -X POST -H "Content-Type: application/json" -d "{}" `
  "$BaseUrl/auth/logout"

Write-Host "`n== Me (after logout, expect 401) =="
curl.exe -i -b $cookies "$BaseUrl/me"

