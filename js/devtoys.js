const { spawn, exec } = require('child_process');

const apps = [
    "base64",
    "hash",
    "uuid",
    "loremipsum",
    "jsonformat",
    "jsonyaml",
    "jwt",
    "colorblind",
    "imgcomp",
    "markdown",
    "regex",
    "baseconverter",
    "string",
    "url",
    "html",
    "diff",
    "settings"
];

let args = process.argv.slice(2);
args = args.filter(a => apps.includes(a));

if (args.length > 0) {
    let cmd = "devtoys:?tool=";
    for (let a of args) {
        spawn('start', [cmd + a], {
            detached: true,
            stdio: "ignore",
            shell: true
        }).unref();
    }
} else {
    spawn('start', ["devtoys:"], {
        detached: true,
        stdio: "ignore",
        shell: true
    }).unref();
}