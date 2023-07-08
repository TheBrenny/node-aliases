const bossman = require('big-kahuna').dashCare(true);
const fs = require('fs');
const path = require('path');
const zen = require("./lib/zen");

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
const descriptorFile = path.join(aliasFolder, "js", "res", "descriptors.json");

if (bossman.weight == 0) {
    console.log(`Opening [${aliasFolder}] folder in 'zen'...`);
    zen([]);
} else if (bossman.has('-a', '--all', '-l', '--list', '--ls')) {
    let descriptors = JSON.parse(fs.readFileSync(descriptorFile));
    let maxName = Object.keys(descriptors).reduce((a, c) => Math.max(a, c.length), 0);
    for(let d of Object.entries(descriptors).sort()) {
        console.log(d[0].padStart(maxName) + ": " + d[1]);
    }
} else if (bossman.has("-h", "--help", "-?")) {
    printHelp();
} else if (bossman.has("-d", "--descriptors")) {
    console.log(`Opening [${descriptorFile}] in 'zen'...`);
    zen([descriptorFile]);
} else if (bossman.weight >= 1) {
    let items = [];

    for (let i = 0; i < bossman.weight; i++) {
        let alias = bossman.must.cabinet(i);

        const cmdLoc = path.join(aliasFolder, alias + ".cmd");
        const jsLoc = path.join(aliasFolder, "js", alias + ".js");
        const psLoc = path.join(aliasFolder, alias + ".ps1")

        // if the cmd exists and the js exists, just open the js
        if (fs.existsSync(cmdLoc)) {
            if (fs.existsSync(jsLoc)) items.push(jsLoc);
            else items.push(cmdLoc);
        } else if (fs.existsSync(psLoc)) {
            items.push(psLoc);
        } else {
            fs.writeFileSync(cmdLoc, cmdContents);
            fs.writeFileSync(jsLoc, `console.log("Hello, ${alias}");`);
            items.push(jsLoc);

            let descriptors = JSON.parse(fs.readFileSync(descriptorFile));
            descriptors[alias] = descriptors[alias] ?? "\x1b[31m ----- NO DESCRIPTION GIVEN! -----\x1b[0m";
            fs.writeFileSync(descriptorFile, JSON.stringify(descriptors, null, 4));
        }
    }

    zen(items);
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
        "            Lists all aliases and their descriptions.",
        "",
        "    - alias -d",
        "    - alias --descriptors",
        "            Opens the descriptor file for modifications.",
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
    console.log(out.join("\n"));
}