$dir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$codeProfile = "$dir\zen.code-profile"
Set-Content -Path $codeProfile -Value ((Get-Content -Path $codeProfile).Replace("{{zen.css}}", ("$dir/zen.css".Replace("\","/"))))
