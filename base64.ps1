param(
    [Parameter()]
    [Switch]
    $Decode,

    [Parameter()]
    [Int]
    $Wrap = 76,

    [Parameter()]
    [ValidateSet("shift_jis", "IBM860", "ibm861", "IBM880", "DOS-862", "IBM863", "gb2312", "IBM864", "IBM865", "cp866", "koi8-u", "IBM037", "ibm869", "IBM500", "x-mac-icelandic", "IBM01140", "IBM01141", "IBM01142", "IBM273", "IBM01143", "IBM01144", "IBM01145", "windows-1250", "IBM01146", "windows-1251", "IBM01147", "macintosh", "windows-1252", "DOS-720", "IBM277", "IBM01148", "x-mac-japanese", "windows-1253", "IBM437", "IBM278", "IBM01149", "x-mac-chinesetrad", "windows-1254", "windows-1255", "Johab", "windows-1256", "x-mac-arabic", "windows-1257", "x-mac-hebrew", "windows-1258", "x-mac-greek", "x-mac-cyrillic", "IBM00924", "iso-8859-2", "iso-8859-3", "iso-8859-4", "iso-8859-5", "iso-8859-6", "IBM870", "iso-8859-7", "iso-8859-8", "iso-8859-9", "x-mac-turkish", "x-mac-croatian", "windows-874", "cp875", "IBM420", "ks_c_5601-1987", "IBM423", "IBM424", "IBM280", "IBM01047", "IBM284", "IBM285", "x-mac-romanian", "EUC-JP", "x-mac-ukrainian", "x-Europa", "ibm737", "x-IA5", "big5", "x-cp20936", "x-IA5-German", "x-IA5-Swedish", "x-IA5-Norwegian", "koi8-r", "ibm775", "iso-8859-13", "IBM290", "iso-8859-15", "x-Chinese-CNS", "ASMO-708", "IBM297", "x-mac-thai", "x-cp20001", "IBM905", "x-Chinese-Eten", "x-ebcdic-koreanextended", "x-cp20003", "x-cp20004", "x-cp20005", "ibm850", "IBM-Thai", "ibm852", "IBM871", "x-mac-ce", "IBM855", "cp1025", "x-cp20949", "ibm857", "IBM00858", "x-cp20261", "IBM1026", "x-cp20269", "utf-16", "utf-16BE", "utf-32", "utf-32BE", "us-ascii", "iso-8859-1", "utf-8")]
    [String]
    $Encoding = "utf-8",

    [Parameter(Position = 0, ValueFromPipeline)]
    $Data = $null
)

$EncodingNS = [Text.Encoding]::GetEncoding($Encoding)

if($Decode) { Write-Output ($EncodingNS.GetString([Convert]::FromBase64String(($Data -replace "`n","")))) }
else { 
    $Out = ([Convert]::ToBase64String($EncodingNS.GetBytes($Data)))
    if($Wrap -gt 0) { $Out = (($Out -split "(.{$Wrap})" | ? {$_ -ne ""} ) -join "`n") }
    Write-Output $Out
}
