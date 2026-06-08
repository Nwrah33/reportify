Set WshShell = CreateObject("WScript.Shell")
' Clean .next cache first to avoid CSS issues
WshShell.Run "cmd.exe /c if exist C:\Users\ASUS\AppData\Local\Temp\opencode\reportify\frontend\.next rmdir /s /q C:\Users\ASUS\AppData\Local\Temp\opencode\reportify\frontend\.next", 0, True
WshShell.Run "cmd.exe /c cd /d C:\Users\ASUS\AppData\Local\Temp\opencode\reportify\backend && npm run start:dev", 0, False
WScript.Sleep 5000
WshShell.Run "cmd.exe /c cd /d C:\Users\ASUS\AppData\Local\Temp\opencode\reportify\frontend && npm run dev", 0, False
WScript.Sleep 5000
WshShell.Run "cmd.exe /c lt --port 3000 > C:\Users\ASUS\AppData\Local\Temp\opencode\lt-url.txt 2>&1", 0, False
