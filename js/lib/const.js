const path = require('path');

const shimFolder = process.env.ShimFolder || path.normalize("C:\\bin\\");
const aliasFolder = process.env.AliasFolder || path.join(process.env.USERPROFILE, ".aliases");

module.exports = {
    shimFolder,
    aliasFolder
}