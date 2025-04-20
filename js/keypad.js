(async () => { // wrapped in async for chalk :(
    const chalk = (await import("chalk")).default;
    const tc = require("transposition-cracker");
    let args = Array.from(process.argv);
    args.splice(0, 2);

    let dashes = args.filter(v => v.startsWith("-")).map(v => v.substring(1)).join("");
    let spaces = dashes.includes("s");
    let reverse = dashes.includes("r");
    args = args.filter(v => !v.startsWith("-"));

    const lookupTable = ["#*+", " ", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuvw", "xyz"]

    if (args.length === 0) {
        //print help
        console.log("Usage: phone [-s] [-r] <word...>")
        console.log("");
        console.log("    -s   Print spaces instead of the number '1'");
        console.log("    -r   Execute a reverse lookup on a number, and match against a hue");
        console.log("");
        console.log("    Converts words into phone numbers. Add as many words as you want!");
        process.exit(1);
    }

    let ret = {};
    let len = 0;

    if (reverse) {
        (async () => {
            function getNext(arr, num, i, str) {
                if (i >= num.length) {
                    arr.push(str)
                    return arr;
                }

                let letters = lookupTable[parseInt(num.charAt(i))];
                letters.split("").forEach((l, lI, lA) => {
                    let tStr = str + l;
                    getNext(arr, num, i + 1, tStr);
                });
                return arr;
            }
            function score(value) {
                return tc.hue(tc.score(value));
            }

            for (let num of args) {
                let results = [];
                getNext(results, num, 0, "");
                await tc.onReady;
                results = results.map(r => ({ val: r, score: score(r) }));
                ret[num] = results.sort((a, b) => b.score - a.score).map(r => r.val);
                // ret[num] = results.sort((a, b) => b.score - a.score).map(r => r.val + " - " + r.score);
                for (let i = 0; i < 3; i++) {
                    ret[num][i] = chalk.underline.bold(ret[num][i]);
                }
            }

            console.log("");
            console.log("Matches:")
            for (let e of Object.entries(ret)) {
                console.log("  " + chalk.yellow(e[0]) + ":");
                for (let m of e[1]) {
                    console.log("    " + chalk.green(m));
                }
            }
        })();
    } else {
        for (let a of args) {
            let num = a.split("").map(c => lookupTable.findIndex((g) => g.includes(c)));
            if (spaces) num = num.map(v => v === 1 ? " " : v);
            ret[a] = num.join("");
            len = Math.max(len, a.length);
        }

        console.log("");
        console.log("Matches:")
        for (let e of Object.entries(ret)) {
            console.log("  " + chalk.yellow(e[0].padStart(len, " ")) + " -- " + chalk.green(e[1]))
        }
    }
    console.log("");
    console.log("Thank you, come again!");
})();
