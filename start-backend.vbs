Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd.exe /c cd /d C:\Users\ASUS\AppData\Local\Temp\opencode\reportify\backend && npm run start:prod", 0, False
