if (process.argv.length == 2) {
    console.log("Usage: math <...equation>");
    console.log("  Where equation can be any length of anything that gets piped directly to a JS eval statement. So be careful!");
    console.log("  (Interactive mode coming soon!)");
} else {
    const Isolate = require("isolated-vm").Isolate;
    const iso = new Isolate({ memoryLimit: 8 });
    const context = iso.createContextSync();

    let expr = process.argv.slice(2);
    let silent = process.argv[2] === "-s";
    if (silent) expr = expr.slice(1);

    expr = expr.join(" ");
    let ans = context.evalSync(expr, { promise: false });

    if (!silent) process.stdout.write(`${expr} = \x1b[33m`);
    process.stdout.write(ans.toString());
    if (!silent) process.stdout.write(`\x1b[0m`);
    process.stdout.write("\n");
}