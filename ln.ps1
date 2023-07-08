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
if ($LinkType -eq "Directory") { $LinkType = "DirectoryJunction" }
if ($LinkType -eq "Junction") { $LinkType = "DirectoryJunction" }
if ($LinkType -eq "Hard") { $LinkType = "HardLink" }


New-Item -Path $Link -Value $Real -ItemType $LinkType