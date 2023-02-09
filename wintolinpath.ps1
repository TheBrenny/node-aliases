$aa = $args[0]
$aa = $aa -replace "\\", "/"
$m = ($aa -match "(.):/")
if ($m) { $aa = $aa -replace ".:/", "/mnt/$($Matches[1].ToLower())/" }
Write-Output $aa