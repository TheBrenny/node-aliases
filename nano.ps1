$a = @()
foreach ($aa in $args) { $a += (wintolinpath.ps1 $aa) }
wsl.exe nano $a