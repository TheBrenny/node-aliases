$green = "32"
$normal = "0"

$hist = (Get-History).CommandLine

foreach($a in $args) {
    $hist = $hist | Select-String $a -NoEmphasis | %{ $_ -replace $a, "`e[$($green)m$($a)`e[$($normal)m" }
}

Return $hist | Get-Unique