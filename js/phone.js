const tc = require("transposition-cracker");
const colors = require("colors");
let args = Array.from(process.argv);
args.splice(0, 2);

let dashes = args.filter(v => v.startsWith("-")).map(v => v.substring(1)).join("");
let spaces = dashes.includes("s");
let reverse = dashes.includes("r");
args = args.filter(v => !v.startsWith("-"));

const lookupTable = ["#*+", " ", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuvw", "xyz"]

if (args.length === 0) {
    //print help
    console.log("Usage: phone -s <word...>")
    console.log("")
    console.log("    Converts words into phone numbers. Add as many words as you want!")
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
                ret[num][i] = ret[num][i].underline.bold;
            }
        }

        console.log("");
        console.log("Matches:")
        for (let e of Object.entries(ret)) {
            console.log("  " + e[0].yellow + ":");
            for (let m of e[1]) {
                console.log("    " + m.green);
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
        console.log("  " + e[0].padStart(len, " ").yellow + " -- " + e[1].green)
    }
}
console.log("");
console.log("Thank you, come again!");