$a = @()

foreach ($aa in $args) {
    $aa = $aa -replace "\\", "/"
    $m = ($aa -match "(.):/")
    if ($m) { $aa = $aa -replace ".:/", "/mnt/$($Matches[1].ToLower())/" }
    $a += $aa
}

wsl.exe file $a