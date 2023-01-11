@echo off
if "%1"=="h" goto begin
start mshta vbscript:createobject("wscript.shell").run("""%~nx0"" h",0)(window.close)&&exit
:begin

xcopy D:\Drive\emm0\html D:\Drive\emm0\x /s /e /i /y
del /f /s /q D:\Drive\emm0\x\left.html
del /f /s /q D:\Drive\emm0\x\right.html

echo D:\Drive\emm0\x>%systemroot%\temp\clip.txt
clip<%systemroot%\temp\clip.txt
del %systemroot%\temp\clip.txt

start "" "D:\Drive\emm0\ex\show_desktop.lnk" 
start "" "C:\Program Files (x86)\Softany\WinCHM\winchm.exe"

start "" "D:\Drive\emm0\ex\winchm_clicker.rsmk"
choice /t 30 /d y /n >nul

copy D:\Drive\emm0\x_output\WebHelp\data.js D:\Drive\emm0\js\ /y
rd /s /q D:\Drive\emm0\x_output
rd /s /q D:\Drive\emm0\x
