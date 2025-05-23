param(
    [Parameter()]
    [Switch]
    $Decode,

    [Parameter()]
    [Int]
    $Wrap = 76,
    
    [Parameter(Position = 0, ValueFromPipeline)]
    $Data = $null
)

if($Decode) { Write-Output ([Text.Encoding]::UTF8.GetString([Convert]::FromBase64String(($Data -replace "`n","")))) }
else { 
    $Out = ([Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($Data)))
    if($Wrap -gt 0) { $Out = (($Out -split "(.{$Wrap})" | ? {$_ -ne ""} ) -join "`n") }
    Write-Output $Out
}
