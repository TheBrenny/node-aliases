(async () => {
    const green = "\033[32m";
    const normal = "\033[0m";

    const shellHist = require("./util").history;
    let res = [];
    let count = 200;

    if (process.argv.length > 2) {
        let search = process.argv[2];
        let count = process.argv?.[3] ?? count;

        let regexMatch = search.match(/^\/(.*)\/([gimsuy]*)$/);
        if (regexMatch) {
            search = new RegExp(regexMatch[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), Array.from(regexMatch[2] + "g").filter((c, i, a) => a.indexOf(c) === i).join(""));
        } else {
            search = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "g");
        }

        res = (await shellHist(count)).reverse().filter(cmd => search.test(cmd)).map(cmd => cmd.replace(search, green + "$&" + normal));
    } else {
        count = 20;
        res = (await shellHist(count)).reverse();
    }

    console.log()
    console.log(res.join("\n"));
})();