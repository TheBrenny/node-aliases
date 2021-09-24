// https://johnstonsoftwaresolutions.com/2019/02/09/tip-switch-monitor-inputs-with-command-line/

const spawnSync = require("child_process").spawnSync;

const app = "cmm.exe";
const monitor = "\\\\.\\DISPLAY2\\Monitor0";
const vcpCode = "60";
const laptopVal = "17";
const rpiVal = "18";

let setArgs = [];

if (process.argv[2] === "switch") {
    setArgs.push("/SwitchValue", monitor, vcpCode, laptopVal, rpiVal);
} else {
    setArgs.push("/SetValueIfNeeded", monitor, "60");
    if (process.argv[2] === "laptop") {
        setArgs.push(laptopVal);
    } else if (process.argv[2] === "rpi") {
        setArgs.push(rpiVal);
    } else {
        console.log("Bad command! Use 'laptop' or 'rpi'.");
        process.exit(1);
        return 1;
    }
}

let s = spawnSync(app, setArgs, {
    shell: true,
    windowsHide: true,
    stdio: "inherit"
});

process.exit(s.status);