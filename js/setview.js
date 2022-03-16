// https://johnstonsoftwaresolutions.com/2019/02/09/tip-switch-monitor-inputs-with-command-line/

const path = require("path");
const spawnSync = require("child_process").spawnSync;
const settings = require("./setviewsettings");
const inputVals = Object.values(settings).map(v => v.input);

const app = "cmm.exe";
const monitor = "MONITOR\\AUS28B1\\{4d36e96e-e325-11ce-bfc1-08002be10318}\\0002";

const vcp = {
    "input": "60",
    "color": "B5"
};

if (process.argv[2] === "switch") {
    let val = exec(app, ["/GetValue", monitor, vcp.input]).status;
    let nextInput = inputVals[(inputVals.indexOf(val) + 1) % inputVals.length];
    nextInput = Object.entries(settings).find(([key, val]) => val.input == nextInput);
    handleResponseAndExit(setSettings(input));
} else {
    if (settings[process.argv[2]] ?? false) {
        let input = settings[process.argv[2]];
        handleResponseAndExit(setSettings(input));
    } else if (process.argv[2] === "--settings") {
        exec("zen", ['"' + path.join(__dirname, "setviewsettings.json") + '"']);
    } else {
        console.log(`Bad command! Use ${Object.keys(settings).map(k => `'${k}'`).join(", ")} or 'switch'.`);
        console.log("Alternatively, change settings by using the arg '--settings'.")
        process.exit(1);
    }
}

function exec(cmd, args) {
    return spawnSync(cmd, args, {
        shell: true,
        windowsHide: true,
        stdio: "inherit"
    });
}

function setSettings(input) {
    let response = [
        exec(app, ["/SetValue", monitor, vcp.input, input.input]),
        exec(app, ["/SetValue", monitor, vcp.color, input.color]),
    ];
    let signals = [
        input.color,
        input.input,
    ]
    return [response, signals];
}
function handleResponseAndExit(results) {
    if (!results[0].every(r => r.error === undefined && r.stderr === null)) {
        console.error("Something went wrong.");
        process.exit(-1);
    }
    if (!results[0].every((r, i) => r.status === results[1][i])) {
        console.error("One of the signals didn't match the expected result!");
        for (let i = 0; i < results[0].length; i++) {
            console.error((results[0][i].status + "").padEnd(4, " ") + ":  " + results[1][i]);
        }
        process.exit(1);
    }
    process.exit(0);
}