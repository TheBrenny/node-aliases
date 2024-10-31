param(
    [Parameter(Mandatory = $True, Position = 0)]
    [ValidateScript({(Test-Path $_) -eq $False})]
    [String]
    $Link,
    
    [Parameter(Mandatory = $True, Position = 1)]
    [ValidateScript({Test-Path $_})]
    [String]
    $Real,

    [Parameter()]
    [ValidateSet("SymbolicLink", "Symbolic", "DirectoryJunction", "Directory", "Junction", "HardLink", "Hard")]
    [String]
    $LinkType = "SymbolicLink"
)

if ($LinkType -eq "Symbolic") { $LinkType = "SymbolicLink" }
if ($LinkType -eq "DirectoryJunction") { $LinkType = "Junction" }
if ($LinkType -eq "Junction") { $LinkType = "Junction" }
if ($LinkType -eq "HardLink") { $LinkType = "File" }
if ($LinkType -eq "Hard") { $LinkType = "File" }

$Link = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath((Join-Path . $Link))
$Real = (Resolve-Path $Real).Path

New-Item -Path $Link -Value $Real -ItemType $LinkType