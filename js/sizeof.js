const fs = require("fs");
const path = require("path");
const bossman = require("big-kahuna");

let target = process.cwd();

if (bossman.weight > 0) {
    // get sizes of all targets
}

let s = getSize(target); // blocking so wont show output until ready
console.log("Size of: " + target);
console.log(normaliseSize(s));

function getSize(t) {
    let stats = fs.statSync(t);
    if (stats.isFile() || stats.isSymbolicLink()) {
        return stats.size;
    } else if (stats.isDirectory()) {
        let count = 0;
        let files = fs.readdirSync(t);
        files.forEach(e => {
            count += getSize(path.join(t, e));
        });
        return count;
    }
    console.error("\"" + t + "\" is not a file or directory!");
    return 0;
}

function normaliseSize(size) {
    let bytes = size % 1024;
    let kilobytes = (size / 1024) % 1024;
    let megabytes = (size / 1024 / 1024) % 1024;
    let gigabytes = (size / 1024 / 1024 / 1024) % 1024;
    let terabytes = (size / 1024 / 1024 / 1024 / 1024) % 1024;
    let petabytes = (size / 1024 / 1024 / 1024 / 1024 / 1024) % 1024;

    let out = [];
    if (petabytes > 1) return petabytes.toFixed(2) + " pb";
    if (terabytes > 1) return terabytes.toFixed(2) + " tb";
    if (gigabytes > 1) return gigabytes.toFixed(2) + " gb";
    if (megabytes > 1) return megabytes.toFixed(2) + " mb";
    if (kilobytes > 1) return kilobytes.toFixed(2) + " kb";
    if (bytes > 1) return bytes.toFixed(2) + " b";
    return "0 zero size";
}