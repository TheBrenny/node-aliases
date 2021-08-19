if (process.platform !== "win32") return console.error("Can only be run on Windows");

const fs = require("fs");
const path = require("path");

let shellSettingPath = path.resolve(...[
    process.env.appdata,
    "..",
    "Local",
    "Microsoft",
    "PowerToys",
    "PowerToys Run",
    "Settings",
    "Plugins",
    "Microsoft.Plugin.Shell",
    "ShellPluginSettings.json"
]);

try {
    let data = JSON.parse(fs.readFileSync(shellSettingPath));
    data.Shell = 0;
    fs.writeFileSync(shellSettingPath, JSON.stringify(data, null, 4));

    console.log("Restart PowerToys")
} catch (err) {
    console.error("Something bad occured and this failed. Maybe the filepath is wrong, or the file doesn't exist?");
    console.error("Code: " + err.code);
    console.error("Syscall: " + err.syscall);
    console.error("Errno: " + err.errno);
}