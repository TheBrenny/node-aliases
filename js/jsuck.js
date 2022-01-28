const green = "32";
const bold = "1";
const underline = "4";
const normal = "0";

const color = (...args) => ((args = args.length === 0 ? [normal] : Array.from(args)), "\033[" + args.join(";") + "m");

const printHelp = (e) => {
    console.log("Usage: " + color(green, bold) + "jsuck [term]" + color());
    console.log("   term can be any of these:");
    console.log("   " + Object.keys(all).map(t => color(green) + t + color()).join(", "))
    process.exit(e ?? 0);
}

const all = {
    "array.addremove": [
        {
            name: "[].push",
            desc: "add to end"
        },
        {
            name: "[].pop",
            desc: "remove from end"
        },
        {
            name: "[].unshift",
            desc: "add to start"
        },
        {
            name: "[].shift",
            desc: "remove from start"
        },
    ],
    "array.slicing": [
        {
            name: "[].slice",
            desc: "Just returns a section of the array"
        },
        {
            name: "[].splice",
            desc: "Swaps a section of the array (returns removed)"
        }
    ],
    "array.contents": [
        {
            name: "[].includes",
            desc: "checks if array contains item"
        },
        {
            name: "cl.contains",
            desc: "checks if DOM class list contains item"
        }
    ],
    "loops": [
        {
            name: "for...in",
            desc: "loop property names in objects"
        },
        {
            name: "for...of",
            desc: "loop elements in array"
        }
    ],
    "functions": [
        {
            name: "fn.apply()",
            desc: "binds with an array of args"
        },
        {
            name: "fn.bind()",
            desc: "binds with a spread of args"
        },
        {
            name: "fn.call()",
            desc: "executes with a spread of args"
        },
    ],
    "strings": [
        {
            name: "\"\".includes",
            desc: "checks if a string contains a substring"
        }
    ]
};

let out = Object.assign({}, all);

if (process.argv.length > 2) {
    let arg = process.argv[2];
    if (arg === "help") printHelp();

    let sections = Object.keys(all);
    let wanted = arg.split(".");
    for (let s = 0; s < sections.length; s++) {
        let split = sections[s].split(".")
        for (let w = 0; w < wanted.length; w++) {
            if (wanted[w] !== split[w]) {
                delete out[sections[s]];
                break;
            }
        }
    }
}

const maxSize = Object.values(out) // => array of arrays of objs
    .reduce((a, c) => a.concat(c), []) // => 1d array of objs
    .map((obj) => obj.name) // => 1d array of strings
    .reduce((a, c) => Math.max(a, c.length), 0); // => longest string

console.log();
Object.keys(out).forEach(e => {
    console.log(color(green, bold, underline) + e + color());
    out[e].forEach((l) => console.log("    " + color(green) + l.name.padEnd(maxSize, " ") + color() + "  --  " + l.desc));
});

console.log();
console.log("Don't even try to remember these...")
console.log("Just remember...");
console.log();
console.log("> jsuck");