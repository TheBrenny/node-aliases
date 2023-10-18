$editor = "$(where.exe code | Select-Object -First 1)\..\..\Code.exe"
$allArgs = @("--user-data-dir", "$env:USERPROFILE/.vscode-zen", "--extensions-dir", "$env:USERPROFILE/.vscode-zen/extensions")
$allArgs += $PSBoundParameters.Values + $args
Start-Process -FilePath "$editor" -ArgumentList $allArgs -UseNewEnvironment -NoNewWindow -RedirectStandardError "NUL" -RedirectStandardOutput "..\NUL"