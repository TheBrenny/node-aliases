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