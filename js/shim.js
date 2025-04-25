const bossman = require('big-kahuna').dashCare(true);
const fs = require('fs');
const path = require('path');
const {shimFolder, aliasFolder} = require("./lib/const")
const zen = require("./lib/zen");

if (bossman.weight == 0 || bossman.has("-h", "--help", "-?")) {
    printHelp();
} else if (bossman.has('-a', '--all', '-l', '--list', '--ls')) {
    console.log(
        fs.readdirSync(shimFolder)
            .filter((v) => v.endsWith(".shim"))
            .map((v) => v.split(".")[0])
            .join("\n")
    );
} else if (bossman.weight >= 1) {
    let shim = bossman.must.cabinet(0);

    const shimLoc = path.join(shimFolder, shim + ".shim");
    const exeLoc = path.join(shimFolder, shim + ".exe");

    // If the shimLoc doesn't exist, make the shim
    if (!fs.existsSync(shimLoc)) {
        fs.copyFileSync(path.join(__dirname, "res", "shim.exe"), exeLoc)
        fs.writeFileSync(shimLoc, makeShim(bossman.cabinet()));
        console.log(`Shim made at: ${exeLoc}}`);
    } else {
        zen(shimLoc);
    }
}

function makeShim(args) {
    let [name, exe, ...exeArgs] = Array.from(args).concat(["", "", ""]); // Must have 3 args here
    exeArgs = exeArgs.filter((v) => v.length > 0).join(" "); // filter out the empties and make it a string
    return `path = "${exe}"\nargs = ${exeArgs}`;
}

function printHelp() {
    let out = [
        "",
        "   Saves shims to the registered shim folder! Shims are wrapper executables that",
        "   effectively allow symlinking",
        "",
        "   Usage:",
        "    - shim",
        "           Opens the shim folder in zen mode.",
        "",
        "    - shim {name} [path] [args]",
        "           Creates two files: name.shim and name.exe. The exe file contains",
        "           the 'kiennq' shimexe: https://github.com/kiennq/scoop-better-shimexe.",
        "           The name.shim file contains the path and args which the exe will use",
        "           to run the executable.",
        "",
        "    - shim -a",
        "    - shim --all",
        "           Lists all shim files in the shim directory.",
        "",
        "    - shim -h",
        "    - shim -?",
        "    - shim --help",
        "           Shows this help text.",
        "",
        "   To change the location of the shim folder, set the 'ShimFolder' environment",
        "   variable. The current location of the shim folder is:",
        "      " + shimFolder,
        ""
    ];
    console.log(out.join("\n"));
}