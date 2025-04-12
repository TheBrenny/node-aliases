const {
    exec,
    spawn
} = require('child_process');
const path = require('path');
let { aliasFolder } = require("./const");
const { homedir } = require('os');

const IS_WIN = process.platform === "win32";

/** @param {Array} items  */
function zen(items) {
    if (!Array.isArray(items)) items = [items];

    // items = (items || []).map(i => aliasFolder + i);
    items = [aliasFolder].concat(items).map(i => i.replace(" ", "\" \""));

    if (IS_WIN) {
        const zenLoc = path.join(aliasFolder, "zen.ps1");
        items.unshift("pwsh", "-WindowStyle", "Hidden", zenLoc);
    } else {
        const zenArgs = ["code", "--user-data-dir", `${aliasFolder}/js/res/.vscode-zen`, "--extensions-dir", `${aliasFolder}/js/res/.vscode-zen/Extensions`];
        items.unshift(...zenArgs);
    }
    // console.table(items); // debugging
    let child = exec(items.map(e => `"${e}"`).join(" "));
    child.unref();

    // BUG: There seems to be a bug where if the Zen window is NOT open, the calling
    // process stays open. But if the Zen window is already open, the the calling process
    // eventually closes?

    return child;
}

module.exports = zen;