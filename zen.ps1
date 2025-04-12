$editor = "$((Get-Command code).Source | Select-Object -First 1)\..\..\Code.exe"
$allArgs = @("--user-data-dir", "$env:USERPROFILE\.aliases\js\res\.vscode-zen", "--extensions-dir", "$env:USERPROFILE\.aliases\js\res\.vscode-zen\Extensions")
$allArgs += $PSBoundParameters.Values + $args
Start-Process -FilePath "$editor" -ArgumentList $allArgs -UseNewEnvironment -NoNewWindow -RedirectStandardError "NUL" -RedirectStandardOutput "..\NUL"