/*
@call git init
@call gitignore node
@call npm init -y %*
@echo.> readme.md
*/

const { execSync } = require("child_process");
const fs = require("fs/promises");
const path = require("path");
const readline = require("readline").promises;
const rl = readline.createInterface(process.stdin, process.stdout);

const defaults = {
    "version": "1.0.0",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no tests specified. Maybe you could make one?\""
    },
    "author": "TheBrenny <iam@justbrenny.me>",
    "license": "MIT"
};

const pwd = process.cwd();
const packageLoc = path.resolve(pwd, "package.json");
const readmeLoc = path.resolve(pwd, "readme.md");

module.exports = (async () => {
    if(process.argv.includes("--help") || process.argv.includes("-h") || process.argv.includes("help")) {
        process.stdout.write("mknode [pnpm]\n");
        process.stdout.write("       ^- Use pnpm instead of npm\n");
        process.exit(0);
    }

    // exec funcs and get input
    process.stdout.write(`\x1b[36m[git]\x1b[0m `)
    let gitInit = execSync("git init", { stdio: "pipe" });
    process.stdout.write(`${gitInit.toLocaleString().trim()}\n`);

    process.stdout.write(`\x1b[33m[ign]\x1b[0m `);
    let gitignore = execSync("gitignore node", { stdio: "pipe" });
    process.stdout.write(`${gitignore.toLocaleString().trim()}\n`);
    
    process.stdout.write(`\x1b[31m[npm]\x1b[0m `);
    let npm = "npm init -y";
    if(process.argv.includes("pnpm")) npm = "pnpm init";
    let npmInit = execSync(npm, { stdio: "ignore" });
    process.stdout.write(`Wrote package to ${packageLoc}.\n\n`);

    let package = require(path.resolve(pwd, "package.json"));
    let description = process.argv.includes("-y") ? "This is a dummy description!" : (await rl.question(`\x1b[31m[npm]\x1b[0m ${package.name} description: `));
    Object.assign(package, defaults, { description });
    console.log()

    await Promise.allSettled([
        fs.writeFile(packageLoc, JSON.stringify(package, undefined, 4)).then(() => console.log(`\x1b[31m[npm]\x1b[0m Rewrote package to ${packageLoc}`)),
        fs.writeFile(readmeLoc, `# ${package.name}\n\n${package.description}`).then(() => console.log(`\x1b[35m[.md]\x1b[0m Wrote readme to ${readmeLoc}`))
    ]);

    rl.close();
    console.log("\n\x1b[32mAll done!\x1b[0m");
})();