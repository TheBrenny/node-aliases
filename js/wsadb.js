const exec = require("child_process").execSync;

let wsaPort = null;
let tID = null;

let out;

console.log("Making sure WSA is running...");
out = exec("WsaClient.exe").toString();

console.log("Getting WSA IP...");
out = exec("tasklist").toString();
for (let line of out.split("\n")) {
    if (line.includes("WsaClient")) {
        let ps = line.replace(/ +/g, " ").split(" ")[1];
        out = exec("netstat -aon").toString();
        for (let netLine of out.split("\n")) {
            if (netLine.trim().endsWith(ps)) {
                wsaPort = netLine.replace(/ +/g, " ").split(" ")[2].split(":")[1];
                break;
            }
        }
        break;
    }
}
if (wsaPort === null) {
    console.error("WSA IP could not be found!");
    process.exit(1);
}

console.log("Connecting...");
out = exec("adb connect 127.0.0.1:" + wsaPort).toString();

console.log("Getting transport id...");
out = exec("adb devices -l").toString();
for (let line of out.split("\n")) {
    line = line.trim();
    let parts = line.split(":");
    if (parts.length < 2) continue;
    if (parts[1].startsWith(wsaPort)) {
        tID = parts[parts.length - 1];
        break;
    }
}
if (tID === null) {
    console.error("Transport ID could not be found!");
    process.exit(1);
}
console.log(`TID: ${tID}`);

module.exports = tID;