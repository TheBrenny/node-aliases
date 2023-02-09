$a = @()

Write-Host $args

foreach ($aa in $args) {
    echo $aa
    $aa = $aa -replace "\\", "/"
    echo $aa
    $m = ($aa -match "(.):/")
    if ($m) { $aa = $aa -replace ".:/", "/mnt/$($Matches[1].ToLower())/" }
    echo $aa

    $a += $aa
}

wsl.exe nano $a