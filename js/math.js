if (process.argv.length == 2) {
    console.log("Usage: math <...equation>");
    console.log("  Where equation can be any length of anything that gets piped directly to a JS eval statement. So be careful!");
    console.log("  (Interactive mode coming soon!)");
} else {
    let expr = process.argv.slice(2);
    if (process.argv[2] === "-s") expr = expr.slice(1);
    expr = expr.join(" ");

    let ans = eval(expr);
    if (process.argv[2] !== "-s") console.log(`${expr} = \x1b[33m${ans}\x1b[0m`);

    process.exit(ans);
}