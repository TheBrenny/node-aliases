const fs = require('fs');
const path = require('path');
const zen = require("./lib/zen");
const { aliasFolder } = require('./lib/const');

const IS_WIN = process.platform === 'win32';

const cmdContents = [
    fs.readFileSync(path.join(aliasFolder, "js", "res", ".windows.shim")),
    fs.readFileSync(path.join(aliasFolder, "js", "res", ".linux.shim"))
];
const shimTypes = { win: 0, lin: 1 };
const descriptorFile = path.join(aliasFolder, "js", "res", "descriptors.json");

const help = {
    description: "Saves aliases to the registered alias folder!",
    open: "Opens the alias folder in zen mode.",
    create: "Creates two files: name.cmd and js\\name.js. The cmd file contains default text to execute the js file in the Node runtime. The js file contains a 'Hello, name' console command used as a starting point for the js program to function. Zen mode is subsequently opened to the alias folder and the js file.",
    list: "Lists all aliases and their descriptions.",
    descriptors: "Opens the descriptor file for modifications.",
    switchLang: "Switches all eligable node shims into the opposite operating system. Ie, from Batch to Shell and vice verser.",
    switchLangDryRun: "Runs --switch-lang in dry run mode.",
    switchType: "Specifies which type to convert all aliases to",
    folder: "Prints the current aliasFolder location",
}

function getNodeShims() {
    let dir = fs.readdirSync(aliasFolder);
    let shims = [];
    let buffer = Buffer.alloc("#!/bin/bash\n##nodeshim".length);
    let bufferString = "";
    let filePath;
    let fd;
    for (let file of dir) {
        filePath = path.join(aliasFolder, file);

        if (!fs.lstatSync(filePath).isFile()) continue;

        fd = fs.openSync(filePath);
        fs.readSync(fd, buffer, 0, buffer.length, null);
        fs.closeSync(fd);
        bufferString = buffer.toString();

        if (bufferString.includes("nodeshim")) shims.push(file); // is a windows file so include
    }

    return shims;
}

require("yargs")
    .scriptName("alias")
    .showHelpOnFail(true)
    .command("$0", help.open, (y) => { }, (args) => {
        console.log(`Opening [${aliasFolder}] folder in 'zen'...`);
        zen([]);
    })
    .command("list", help.list, (y) => { }, (args) => {
        let descriptors = JSON.parse(fs.readFileSync(descriptorFile));
        let maxName = Object.keys(descriptors).reduce((a, c) => Math.max(a, c.length), 0);
        for (let d of Object.entries(descriptors).sort()) {
            console.log(d[0].padStart(maxName) + ": " + d[1]);
        }
    })
    .command("descriptors", help.descriptors, (y) => { }, (args) => {
        console.log(`Opening [${descriptorFile}] in 'zen'...`);
        zen([descriptorFile]);
    })
    .command("switch", help.switchLang, (y) => {
        y.options({
            dryRun: {
                alias: "d",
                boolean: true,
                description: help.switchLangDryRun
            },
            mode: {
                alias: "m",
                choices: ["win", "lin"],
                description: help.switchType,
            }
        });
    }, (args) => {
        let shims = getNodeShims();
        let dryRun = args.dryRun ? [""] : false;

        console.log("All node shims:")
        console.log(shims.map((s) => `  ${s}`).join("\n"));

        process.stdout.write("\x1b[33m" + shims.map(() => ".").join("") + "\x1b[0m");
        process.stdout.write("\x1b[0G");

        const forceType = args.mode;
        let newType;
        let oldPath;
        let newPath;
        let endsWithCmd;
        for (let shim of shims) {
            endsWithCmd = shim.endsWith(".cmd");
            newType = shimTypes[forceType] ?? 0; // convert to cmd as default
            if (endsWithCmd) newType = shimTypes[forceType] ?? 1; // end on cmd? convert to bash

            oldPath = path.join(aliasFolder, shim);
            let dot = shim.lastIndexOf(".");
            newPath = path.join(aliasFolder, newType === 1 ? shim.substring(0, dot >= 0 ? dot : undefined) : shim + (endsWithCmd ? "" : ".cmd"));

            try {
                if (oldPath === newPath) {
                    process.stdout.write("\x1b[34m.\x1b[0m");
                    continue;
                }

                if (!dryRun) {
                    fs.writeFileSync(oldPath, cmdContents[newType]);
                    fs.renameSync(oldPath, newPath);
                } else dryRun.push(`${oldPath}  ->  ${newPath}`);

                process.stdout.write("\x1b[32m.\x1b[0m");
            } catch (e) {
                process.stdout.write("\x1b[31m.\x1b[0m");
            }
        }

        console.log(); // this is to newline only

        if (dryRun) console.log(`Dry run:\n${dryRun.map((d) => `  ${d}`).join("\n")}`);
        console.log("Done!");
    })
    .command("[aliases...]", help.create, (y) => { }, (args) => {
        let items = [];

        for (let i = 0; i < args._.length; i++) {
            let alias = args._[i];

            const cmdLoc = path.join(aliasFolder, alias + (IS_WIN ? ".cmd" : ""));
            const psLoc = path.join(aliasFolder, alias + ".ps1")
            const jsLoc = path.join(aliasFolder, "js", alias + ".js");

            if (fs.existsSync(cmdLoc)) { // if the cmd exists and the js exists, just open the js
                if (fs.existsSync(jsLoc)) items.push(jsLoc);
                else items.push(cmdLoc);
            } else if (fs.existsSync(psLoc)) { // if the cmd doesn't exist, but the ps1 exists, open that instead
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
    }).argv;
