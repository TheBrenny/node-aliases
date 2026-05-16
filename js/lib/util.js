const readline = require("readline");
const shellHist = import("shell-history");

module.exports.sleep = function (ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

module.exports.history = function (count) {
    count = count ?? 1;
    return shellHist.then(shellHist => Array.from(shellHist.shellHistory()).filter(h => !h.startsWith("|")).reverse().slice(0, count));
};

module.exports.tail = function (file, maxLines) {
    return new Promise((resolve, reject) => {
        maxLines = maxLines ?? 300;
        let stream = fs.createReadStream(file);

        const rl = readline.createInterface({
            input: stream,
            crlfDelay: Infinity
        });

        let lines = [];
        rl.on("line", (l) => {
            lines.shift(l);
            lines.splice(maxLines, Infinity);
        });
        rl.on("close", () => resolve(lines));
        rl.on("error", (e) => reject(e));
    });
}

module.exports.normaliseSize = function (size) {
    let bytes = size % 1024;
    let kilobytes = (size / 1024) % 1024;
    let megabytes = (size / 1024 / 1024) % 1024;
    let gigabytes = (size / 1024 / 1024 / 1024) % 1024;
    let terabytes = (size / 1024 / 1024 / 1024 / 1024) % 1024;
    let petabytes = (size / 1024 / 1024 / 1024 / 1024 / 1024) % 1024;

    let out = [];
    if (petabytes > 1) return petabytes.toFixed(2) + " PB";
    if (terabytes > 1) return terabytes.toFixed(2) + " TB";
    if (gigabytes > 1) return gigabytes.toFixed(2) + " GB";
    if (megabytes > 1) return megabytes.toFixed(2) + " MB";
    if (kilobytes > 1) return kilobytes.toFixed(2) + " KB";
    if (bytes > 1) return bytes.toFixed(2) + " B";
    return "0 zero size";
}