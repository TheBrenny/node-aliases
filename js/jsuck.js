const green = "32";
const bold = "1";
const underline = "4";
const normal = "0";

const color = (...args) => ((args = args.length === 0 ? [normal] : Array.from(args)), `\x1b[${args.join(";")}m`);

const printHelp = (e) => {
    console.log(`Usage: ${color(green, bold)}jsuck [term]${color()}`);
    console.log("   term can be any of these:");
    console.log(`   ${Object.keys(all).map(t => color(green) + t + color()).join(", ")}`)
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
    "array.comprehension": [
        {
            name: "[...Array(x).keys()]",
            desc: "creates an array of numbers from 0 to x"
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
            desc: "executes with an array of args"
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
        },
        {
            name: "\"1234567\".slice(1, -1)",
            desc: "wraps negative values: \"23456\""
        }
    ],
    "node": [
        {
            name: "require.main === module",
            desc: "determines if this is called from CMD (not required)"
        },
        {
            name: "import.meta.url === pathToFileURL(process.argv[1]).href",
            desc: "determines if this is called from CMD (not required) (for modules)"
        }
    ],
    "random": [
        {
            name: ["Math.random()", ".toString(36).slice(2)"],
            desc: "generates 10 random alpha-numeric characters"
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

let maxSize = 0;
// for(let part in out) {
//     let partArray = out[part];
//     for(let tip of partArray) {

//     }
// }

maxSize = Object.values(out) // => array of arrays of objs
    .reduce((a, c) => a.concat(c), []) // => 1d array of objs
    .map((obj) => typeof obj.name === "string" ? obj.name.length : obj.name.reduce((a, c, i) => c.length + (i > 0 ? 2 : 0) > a ? c.length : a, 0)) // => 1d array of numbers
    .reduce((a, c) => Math.max(a, c), 0); // => number equating to longest string

console.log();
if (Object.keys(out).length > 0) {
    Object.keys(out).forEach(e => {
        console.log(color(green, bold, underline) + e + color());
        out[e].forEach((l) => {
            if (l.name instanceof Array) l.name = l.name.join("\n      ");
            console.log(`    ${color(green)}${l.name.padEnd(maxSize, " ")}${color()}  --  ${l.desc}`)
        });
    });
} else {
    maxSize = Object.keys(all).reduce((a, c) => Math.max(a, c.length), 0);
    console.log("Hmm... It seems that jsuck jsucks...");
    console.log("Here are the categories:");
    Object.keys(all).forEach(e => {
        console.log(`    ${color(green)}${e.padEnd(maxSize, " ")}${color()}  --  ${all[e].length}`);
    });
}

console.log();
console.log("Don't even try to remember these...")
console.log("Just remember...");
console.log();
console.log("> jsuck");