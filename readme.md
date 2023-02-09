A repo with all my Node-based tools, and my aliases. Clone and put on your path to have them too!

The following code block is for the Command Prompt, not PowerShell!

```prompt
> cd js && npm install && cd ..
> setx PATH "%PATH%;%CD%"
> ftype Custom.PowerShellScript="C:\Program Files\PowerShell\7\pwsh.exe" "%0" %*
> assoc .ps1=Custom.PowerShellScript
```

See more at https://dev.to/thebrenny/using-node-because-doskey-hurts-1mfa

See the need for `ftype` and `assoc` at https://superuser.com/questions/1759034/how-do-you-run-powershell-scripts-from-the-command-line-instead-of-opening-note

Required apps for this to work:

| Alias                     | Required commands/programs                                                                                      |
|---------------------------|-----------------------------------------------------------------------------------------------------------------|
| `cheat` and `cheatsh`     | [WSL](https://www.microsoft.com/en-au/p/ubuntu/9nblggh4msv6) and [`cht.sh`](http://cheat.sh/)                   |
| `matlab-cli`              | [Python](https://www.python.org/) and [Matlab](https://www.mathworks.com/products/matlab.html)                  |
| `octave` and `octave-cli` | [Octave](https://www.gnu.org/software/octave/index)                                                             |
| `openhere`                | [VSCode](https://code.visualstudio.com/)                                                                        |
| `phonescreen`             | [`scrcpy`](https://github.com/Genymobile/scrcpy)                                                                |
| `phpmyadmin`              | [Docker](https://www.docker.com/) (passively downloads the `phpmyadmin` image)                                  |
| `sftp-*`                  | `sftp` client enabled                                                                                           |
| `ssh-*`                   | `ssh` client enabled                                                                                            |
| `vscode` and `zen`        | [VSCode](https://code.visualstudio.com/)                                                                        |
| `alias`                   | `zen` alias is used                                                                                             |
| `fixptrun`                | (only useful with [Windows PowerToys](https://docs.microsoft.com/en-us/windows/powertoys/))                     |
| `setview`                 | [ControlMyMonitor](https://www.nirsoft.net/utils/control_my_monitor.html)                                       |
| `term`                    | [Windows Terminal](https://github.com/microsoft/terminal)                                                       |
| `pwsh`                    | [PowerShell 7](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell-on-windows) |