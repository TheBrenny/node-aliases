const {
    exec
} = require('child_process');
const path = require('path');
let { aliasFolder } = require("./const");
const { homedir } = require('os');

const IS_WIN = process.platform === "win32";

function zen(items) {
    if (!Array.isArray(items)) items = [items];

    // items = (items || []).map(i => aliasFolder + i);
    items = [aliasFolder].concat(items).map(i => i.replace(" ", "\" \""));

    if (IS_WIN) {
        const zenLoc = path.join(aliasFolder, "zen.ps1");
        items.unshift("pwsh", "-WindowStyle", "Hidden", zenLoc);
    } else {
        const zenArgs = ["code", "--user-data-dir", `${homedir()}/.vscode-zen`, "--extensions-dir", `${homedir()}/.vscode-zen/extensions`];
        items.unshift(...zenArgs);
    }
    // console.table(items); // debugging
    exec(items.map(e => `"${e}"`).join(" "));
}
module.exports = zen;