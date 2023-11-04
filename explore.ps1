if($args.Count -ge 1) {
    foreach($a in $args) {
        cmd.exe /c "explorer.exe $a"
    }
} else {
    explorer.exe .
}