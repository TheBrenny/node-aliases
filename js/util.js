let cp = require("child_process");

module.exports.sleep = function (ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

module.exports.history = function () {
    let dk = cp.spawnSync("doskey", ["/history"]);
    return dk.stdout.toString().replace(/\n/g, '').split('\r').filter(v => v.trim() != "") || [];
};