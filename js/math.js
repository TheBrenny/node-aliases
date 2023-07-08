const {VM} = require("vm2");

if(process.argv.length == 2) {
    console.log("Usage: math <...equation>");
    console.log("  Where equation can be any length of anything that gets piped directly to a JS eval statement. So be careful!");
    console.log("  (Interactive mode coming soon!)");
} else {
    // TODO: Use the Node Virtual Machine (VM) module!
    let expr = process.argv.slice(2);
    let silent = process.argv[2] === "-s";
    if(silent) expr = expr.slice(1);

    expr = expr.join(" ");
    // let ans = eval(expr);
    let ans = new VM({
        allowAsync: false,
        timeout: 500,
        sandbox: {},
        compiler: "javascript",
        eval: false,
        wasm: false,
    }).run(expr);

    if(!silent) process.stdout.write(`${expr} = \x1b[33m`);
    process.stdout.write(ans.toString());
    if(!silent) process.stdout.write(`\x1b[0m`);
    process.stdout.write("\n");
}