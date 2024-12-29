/*

Quantifiers & Alternation
a*a+a?	0 or more, 1 or more, 0 or 1
a{5}a{2,}	exactly five, two or more
a{1,3}	between one & three
a+?a{2,}?	match as few as possible
ab|cd	match ab or cd

*/

const data = [
    {
        name: "Character classes",
        data: [
            {
                rx: ".",
                desc: "any character except \\n"
            },
            {
                rx: ["\\w", "\\d", "\\s"],
                desc: "word, digit, whitespace"
            },
            {
                rx: ["\\W", "\\D", "\\S"],
                desc: "not word, digit, whitespace"
            },
            {
                rx: "[abc]",
                desc: "any of a, b, or c"
            },
            {
                rx: "[^abc]",
                desc: "not a, b, or c"
            },
            {
                rx: "[a-g]",
                desc: "character between a and g (inclusive)"
            },
        ]
    },
    {
        name: "Anchors",
        data: [
            {
                rx: "^abc$",
                desc: "start/end of the string/line"
            },
            {
                rx: ["\\b", "\\B"],
                desc: "word, not word boundary (end of word or not)"
            },
        ]
    },
    {
        name: "Escaped characters",
        data: [
            {
                rx: ["\\.", "\\*", "\\\\"],
                desc: "escaping special characters"
            },
            {
                rx: ["\\t", "\\n", "\\r"],
                desc: "tab, newline, carriage return"
            },
            {
                rx: "\\x{ABCDE}",
                desc: "match unicode characters (with /u)"
            },
        ]
    },
    {
        name: "Groups and lookarounds",
        data: [
            {
                rx: "(abc)",
                desc: "capture group"
            },
            {
                rx: "\\1",
                desc: "backref to matched group 1"
            },
            {
                rx: "(?:abc)",
                desc: "non-capturing group"
            },
            {
                rx: "(?=abc)",
                desc: "positive lookahead"
            },
            {
                rx: "(?!abc)",
                desc: "negative lookahead"
            },
        ]
    },
    {
        name: "Quantifiers and alternations",
        data: [
            {
                rx: ["a*", "a+", "a?"],
                desc: "0 or more, 1 or more, 0 or 1"
            },
            {
                rx: ["a{5}", "a{2,}"],
                desc: "exactly five, two or more"
            },
            {
                rx: "a{1,3}",
                desc: "between 1 and 3"
            },
            {
                rx: ["a+?", "a{2,}?"],
                desc: "match as few as possible"
            },
            {
                rx: "ab|cd",
                desc: "match ab or cd"
            },
        ]
    },
    {
        name: "Flags",
        data: [
            {
                rx: "/i",
                desc: "case insensitive"
            },
            {
                rx: "/g",
                desc: "continue searching from last match"
            },
            {
                rx: "/m",
                desc: "^ and $ matches \\n, not end of string"
            },
            {
                rx: "/u",
                desc: "allow unicode matching (\\x{ABCDE}"
            },
            {
                rx: "/y",
                desc: "resets regex if cannot find another match"
            },
            {
                rx: "/s",
                desc: "allows . to match newlines"
            },

        ]
    },
    {
        name: "Tips and Patterns",
        data: []
    }
];

function collapseRx(rx) {
    return rx instanceof Array ? rx.join("  ") : rx;
}
const colors = ["\x1b[34m", "\x1b[96m"];
let colorIndex = 0;
function colorRx(rx) {
    if (rx instanceof Array) for (let i = 0; i < rx.length; i++) rx[i] = colors[colorIndex++ % colors.length] + rx[i];
    else rx = colors[colorIndex++ % colors.length] + rx;
    return rx;
}

let longestBlock = 0;
let longestRegex = 0;
data.forEach((block) => {
    longestBlock = Math.max(longestBlock, block.name.length);

    block.data.forEach((d) => {
        d.size = collapseRx(d.rx).length;
        longestRegex = Math.max(longestRegex, d.size);
        console.log(longestRegex);
    });

});

longestBlock += 6; // the longest will have '===' on each side

console.log("\n");
data.forEach((block) => {
    let name = block.name;
    let blockSpace = longestBlock - name.length;
    let preBlockHeader = "=".repeat(Math.ceil(blockSpace / 2));
    let postBlockHeader = "=".repeat(Math.floor(blockSpace / 2));

    console.log(`\x1b[92m${preBlockHeader} ${block.name} ${postBlockHeader}\x1b[0m`);
    block.data.forEach((d) => {
        let regexSpace = longestRegex - d.size ?? collapseRx(d.rx).length;
        let preRegexHeader = " ".repeat(Math.ceil(regexSpace / 2))
        let postRegexHeader = " ".repeat(Math.floor(regexSpace / 2))
        console.log(`  ${preRegexHeader + collapseRx(colorRx(d.rx)) + postRegexHeader}\x1b[0m  -  ${d.desc}`)
    });
    console.log("");
});
