const {
    exec
} = require('child_process');
const bossman = require('big-kahuna').dashCare(true);
const fs = require('fs');
const path = require('path');

const shimFolder = process.env.ShimFolder || path.normalize("C:\\bin\\");
const cmdContents = [
    "path = node",
    "args = ",
].join("\n");

if (bossman.weight == 0) {
    console.log(`Opening [${shimFolder}] folder in 'zen'...`);
    zen([]);
} else if (bossman.has('-a', '--all', '-l', '--list', '--ls')) {
    exec("dir /b \"" + shimFolder + "*.shim\"", (err, stdout, stderr) => {
        if (err) {
            console.log(stderr);
            process.exit(parseInt(err) || 1);
        } else console.log(stdout);
    });
} else if (bossman.has("-h", "--help", "-?")) {
    printHelp();
} else if (bossman.weight >= 1) {
    let shim = bossman.must.cabinet(0);

    const shimLoc = path.join(shimFolder, shim + ".shim");
    const exeLoc = path.join(shimFolder, shim + ".exe");

    // If the shimLoc doesn't exist, make the shim
    if (!fs.existsSync(shimLoc)) {
        fs.copyFileSync(path.join(__dirname, "res", "shim.exe"), exeLoc)
        fs.writeFileSync(shimLoc, makeShim(bossman.cabinet()));
    }

    zen([shimLoc]);
}

function zen(items) {
    // items = (items || []).map(i => shimFolder + i);
    items = [shimFolder].concat(items).map(i => i.replace(" ", "\" \""));

    const zenLoc = path.join(shimFolder, "zen.ps1");
    items.unshift("pwsh", "-WindowStyle", "Hidden", zenLoc);

    // console.table(items); // debugging
    exec(items.map(e => `"${e}"`).join(" "));
}

function makeShim(args) {
    let [name, exe, exeArgs] = [...args, "", "", ""].slice(0, 3); // Ensure we get an array of length 3
    return `path = "${exe}"\nargs = ${exeArgs}`;
}

function printHelp() {
    let out = [
        "",
        "   Saves shims to the registered shim folder!",
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
        "   To change the location of the shim folder, set the 'shimFolder' variable.",
        "   The current location of the shim folder is:",
        "      " + shimFolder,
        ""
    ];
    out.forEach(o => console.log(o));
}