const { spawn, exec } = require('child_process');
const bossman = require("big-kahuna");

let cmd = [];

for (let i = 0; i < bossman.weight; i++) {
    let c = bossman.cabinet(i);
    if (!c.startsWith("-")) {
        cmd.push(";", "-p", getReplType(c));
    }
}

execWT();

function getReplType(q) {
    if (q === "ps") q = "\"Windows Powershell\"";
    else if (["bash", "linux", "ubuntu"].includes(q)) q = "Ubuntu";
    else if (["hack", "kali"].includes(q)) q = "Kali";
    else if (["node", "js", "nodejs"].includes(q)) q = "NodeJS";
    else if (["py2", "python2"].includes(q)) q = "Python2";
    else if (["py", "python"].includes(q)) q = "Python3";
    else if (["ml", "matlab"].includes(q)) q = "Matlab";
    else q = "\"Command Prompt\"";

    return q;
}

function execWT() {
    if (cmd[0] === ";") cmd = cmd.slice(1);

    spawn('"wt"', cmd, {
        detached: true,
        stdio: "ignore",
        shell: true
    }).unref();
    // exec(["wt"].concat(cmd).join(" "));
}