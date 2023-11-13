const { execSync } = require('child_process');
let { aliasFolder } = require("./const");

function git(...items) {
    items = items.map(i => i.replace(" ", "\" \""));
    items = ["git", ...items];

    // console.table(items); // debugging
    execSync(items.map(e => `'${e}'`).join(" "), { stdio: "pipe", cwd: aliasFolder });
}

module.exports = git;