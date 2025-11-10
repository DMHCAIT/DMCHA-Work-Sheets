Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  SUPABASE DATABASE SETUP - DMHCA WORKSHEETS PORTAL  " -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ Backend is configured with Supabase credentials" -ForegroundColor Green
Write-Host "✅ Connection URL: https://hnymialotvmtzyeignex.supabase.co" -ForegroundColor Green
Write-Host ""

Write-Host "📋 NEXT STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Open Supabase SQL Editor:" -ForegroundColor White
Write-Host "   https://supabase.com/dashboard/project/hnymialotvmtzyeignex/sql" -ForegroundColor Cyan
Write-Host ""

Write-Host "2️⃣  Open schema.sql file (opening now...)" -ForegroundColor White
Start-Process "notepad.exe" -ArgumentList "D:\Users\Admin\Desktop\DMHCA Work Sheets\backend\database\schema.sql"
Start-Sleep -Seconds 1

Write-Host "3️⃣  Copy ALL contents of schema.sql" -ForegroundColor White
Write-Host "   Paste into Supabase SQL Editor and click 'Run'" -ForegroundColor Gray
Write-Host ""

Write-Host "4️⃣  Open seed.sql file (opening now...)" -ForegroundColor White
Start-Process "notepad.exe" -ArgumentList "D:\Users\Admin\Desktop\DMHCA Work Sheets\backend\database\seed.sql"
Start-Sleep -Seconds 1

Write-Host "5️⃣  Copy ALL contents of seed.sql" -ForegroundColor White
Write-Host "   Paste into Supabase SQL Editor and click 'Run'" -ForegroundColor Gray
Write-Host ""

Write-Host "6️⃣  After running both SQL files, press Enter to continue..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "✅ Great! Now starting the backend server..." -ForegroundColor Green
Write-Host ""

Set-Location "D:\Users\Admin\Desktop\DMHCA Work Sheets\backend"
npm start
