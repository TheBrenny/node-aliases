const notify = require("node-notifier").notify;
const bossman = require("big-kahuna");
const history = require("./util").history;

let n = {
    wait: false
};

if (bossman.weight == 0) {
    let h = history();
    if (h.length > 0) n.message = (h[h.length - 2] || "Command").split(" ")[0] + " complete.";
    else n.message = `Notification at ${new Date().toLocaleString()}`;
} else if (bossman.weight == 1) {
    n.message = bossman.cabinet(0);
} else if (bossman.weight == 2) {
    n.title = bossman.cabinet(0);
    n.message = bossman.cabinet(1);
}

notify(n);