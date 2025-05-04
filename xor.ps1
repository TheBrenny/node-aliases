param(
    [Parameter(Mandatory = $True, Position = 0)]
    [ValidateScript({(Test-Path $_)})]
    [String]
    $InputFile,
    
    [Parameter(Mandatory = $True, Position = 1)]
    [String]
    $OutputFile,

    [Parameter(Mandatory = $True, Position = 2)]
    [String]
    $Key
)

if(![System.IO.Path]::IsPathRooted($OutputFile)) {
    $OutputFile = [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $OutputFile))
}

# Load source file bytes
$inputBytes = [System.IO.File]::ReadAllBytes((Resolve-Path $InputFile))
$keyBytes = [System.Text.Encoding]::UTF8.GetBytes($Key)
$keyLength = $keyBytes.Length

# XOR operation
for ($i = 0; $i -lt $inputBytes.Length; $i++) {
    $inputBytes[$i] = $inputBytes[$i] -bxor $keyBytes[$i % $keyLength]
}

# Write XOR'd bytes to output
echo $OutputFile
[System.IO.File]::WriteAllBytes($OutputFile, $inputBytes)

Write-Host "XOR operation complete. Output written to $OutputFile"