const { spawn, exec } = require('child_process');
const bossman = require("big-kahuna").dashCare(true);

let cmd = [];

for (let i = 0; i < bossman.weight; i++) {
    let c = bossman.cabinet(i);
    let s = c.charAt(0);

    switch (s) {
        case "-":
            cmd.push(c.substr(1));
            break;
        case "/":
            let termCommand = c.substring(1);
            switch (termCommand) {
                case "pwd":
                    cmd.push("-d", process.cwd());
                    break;
            }
            break;
        default:
            cmd.push(";", "-p", getReplType(c));
            break;
    }
}

execWT();

function getReplType(q) {
    if (q === "ps") q = "Windows Powershell";
    else if (["bash", "linux", "ubuntu"].includes(q)) q = "Ubuntu";
    else if (["hack", "kali"].includes(q)) q = "Kali";
    else if (["node", "js", "nodejs"].includes(q)) q = "NodeJS";
    else if (["py2", "python2"].includes(q)) q = "Python2";
    else if (["py", "python"].includes(q)) q = "Python3";
    else if (["ml", "matlab"].includes(q)) q = "Matlab";
    else if (["cmd"].includes(q)) q = "Command Prompt";
    else q = "Command Prompt";

    return q;
}

function execWT() {
    if (cmd[0] === ";") cmd = cmd.slice(1);
    cmd = cmd.map(a => a.indexOf(" ") >= 0 ? '"' + a + '"' : a);
    // console.log(cmd);

    spawn('"wt"', cmd, {
        detached: true,
        stdio: "ignore",
        shell: true
    }).unref();
    // exec(["wt"].concat(cmd).join(" "));
}