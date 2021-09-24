const {
    spawn,
    exec
} = require('child_process');
const bossman = require('big-kahuna').dashCare(true);
const fs = require('fs');
const path = require('path');

const aliasFolder = process.env.AliasFolder || path.join(process.env.USERPROFILE, ".aliases");
const cmdContents = [
    '@ECHO off',
    'SETLOCAL',
    '',
    'SET curdir=%~dp0',
    'SET fileCalled=%~n0',
    '',
    'SET "_prog=node"',
    'SET PATHEXT=%PATHEXT:;.JS;=;%',
    '',
    '"%_prog%"  "%curdir%\\js\\%fileCalled%.js" %*',
    'ENDLOCAL',
    'EXIT /b %errorlevel%',
].join("\n");

if (bossman.weight == 0) {
    console.log(`Opening [${aliasFolder}] folder in 'zen'...`);
    zen([]);
} else if (bossman.has('-a', '--all', '-l', '--list', '--ls')) {
    exec("dir /b \"" + aliasFolder + "\"", (err, stdout, stderr) => {
        if (err) {
            console.log(stderr);
            exit(err);
        } else console.log(stdout);
    });
} else if (bossman.has("-h", "--help", "-?")) {
    printHelp();
} else if (bossman.weight >= 1) {
    let items = [];

    for (let i = 0; i < bossman.weight; i++) {
        let alias = bossman.must.cabinet(i);

        if (!fs.existsSync(path.join(aliasFolder, alias + ".cmd"))) {
            fs.writeFileSync(path.join(aliasFolder, alias + ".cmd"), cmdContents);
            fs.writeFileSync(path.join(aliasFolder, "js", alias + ".js"), `console.log("Hello, ${alias}");`);
        }

        items.push(path.join(aliasFolder, "js", alias + ".js"));
    }

    zen(items);
}

function zen(items) {
    // items = (items || []).map(i => aliasFolder + i);
    items = [aliasFolder].concat(items).map(i => i.replace(" ", "\" \""));
    // console.table(items); // debugging
    spawn('"zen"', items, {
        detached: true,
        stdio: "ignore",
        shell: true
    }).unref();
}

function printHelp() {
    let out = [
        "",
        "   Saves aliases to the registered alias folder!",
        "",
        "   Usage:",
        "    - alias",
        "            Opens the alias folder in zen mode.",
        "",
        "    - alias {name}",
        "            Creates two files: name.cmd and js\\name.js. The cmd file contains",
        "            default text to execute the js file in the Node runtime. The js file",
        "            contains a 'Hello, name' console command used as a starting point",
        "            for the js program to function. Zen mode is subsequently opened to",
        "            the alias folder and the js file.",
        "",
        "    - alias -a",
        "    - alias --all",
        "            Lists all alias files in the alias directory.",
        "",
        "    - alias -h",
        "    - alias -?",
        "    - alias --help",
        "            Shows this help text.",
        "",
        "   To change the location of the alias folder, set the 'aliasFolder' variable.",
        "   The current location of the alias folder is:",
        "      " + aliasFolder,
        ""
    ];
    out.forEach(o => console.log(o));
}