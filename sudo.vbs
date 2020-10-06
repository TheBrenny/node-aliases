Set objArgs = WScript.Arguments
args = ""

If objArgs.Count = 0 Then
    exe = "cmd"
Else
    exe = objArgs(0)

    If objArgs.Count >= 2 Then
        args = args & objArgs(1)
        For it = 2 to objArgs.Count - 1
            args = args & " " & objArgs(it)
        Next
    End If
End If

Set objShell = CreateObject("WScript.Shell")
winDir = objShell.ExpandEnvironmentStrings("%WINDIR%")
Set objShellApp = CreateObject("Shell.Application")
objShellApp.ShellExecute exe, args, "", "runas", 1
Set objShellApp = nothing