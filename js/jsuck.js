const green = "\033[0;32m"
const normal = "\033[0m"

const out = {
    "push": ["[].push", "add to end"],
    "pop": ["[].pop", "remove from end"],
    "unshift": ["[].unshift", "add to start"],
    "shift": ["[].shift", "remove from start"],
    "loopObj": ["for...in", "loop property names in objects"],
    "loopArr": ["for...of", "loop elements in array"],
};

const maxSize = Object.values(out).reduce((a, c) => Math.max(a, c[0].length), 0);

console.log();
Object.values(out).forEach(e => {
    console.log(green + e[0].padEnd(maxSize, " ") + normal + "  --  " + e[1])
});

console.log();
console.log("Don't even try to remember these...")
console.log("Just remember...");
console.log();
console.log("> jsuck");