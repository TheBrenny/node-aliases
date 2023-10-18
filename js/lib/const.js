const { homedir, platform } = require('os');
const path = require('path');

const shimFolder = process.env.ShimFolder || (platform() === "win32" ? path.normalize("C:\\bin\\") : path.normalize("/bin/"));
const aliasFolder = process.env.AliasFolder || path.join(homedir(), ".aliases");

module.exports = {
    shimFolder,
    aliasFolder
}