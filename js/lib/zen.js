const {
    exec
} = require('child_process');
const path = require('path');
let {aliasFolder} = require("./const")

function zen(items) {
    if(!Array.isArray(items)) items = [items];
    
    // items = (items || []).map(i => aliasFolder + i);
    items = [aliasFolder].concat(items).map(i => i.replace(" ", "\" \""));

    const zenLoc = path.join(aliasFolder, "zen.ps1");
    items.unshift("pwsh", "-WindowStyle", "Hidden", zenLoc);

    // console.table(items); // debugging
    exec(items.map(e => `"${e}"`).join(" "));
}
module.exports = zen;