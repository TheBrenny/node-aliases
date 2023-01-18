param(
    # Determines whether the slashes should be single or double
    [Switch] $Slash
)

$p = $pwd.Path

If ($Slash) {
    $p = $p -replace "\\","\\"
}

Return $p