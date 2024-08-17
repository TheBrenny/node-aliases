const fs = require('fs');
const path = require('path');
const zen = require("./lib/zen");
const { aliasFolder } = require('./lib/const');
const git = require('./lib/git');

const IS_WIN = process.platform === 'win32';

const cmdContents = () => [
    fs.readFileSync(path.join(aliasFolder, "js", "res", ".windows.script")),
    fs.readFileSync(path.join(aliasFolder, "js", "res", ".linux.script"))
];
const scriptTypes = { win: 0, lin: 1 };
const descriptorFile = path.join(aliasFolder, "js", "res", "descriptors.json");

const help = {
    description: "Saves aliases to the registered alias folder!",
    open: "Opens the alias folder in zen mode.",
    create: "Creates two files: name.cmd and js\\name.js. The cmd file contains default text to execute the js file in the Node runtime. The js file contains a 'Hello, name' console command used as a starting point for the js program to function. Zen mode is subsequently opened to the alias folder and the js file.",
    list: "Lists all aliases and their descriptions.",
    descriptors: "Opens the descriptor file for modifications.",
    switchLang: "Switches all eligable node alias scripts into the opposite operating system. Ie, from Batch to Shell and vice verser.",
    switchLangDryRun: "Runs --switch-lang in dry run mode.",
    switchType: "Specifies which type to convert all aliases to",
    folder: "Prints the current aliasFolder location",
    update: "Updates the aliases to the latest version",
}

function getNodeSscripts() {
    let dir = fs.readdirSync(aliasFolder);
    let scripts = [];
    let buffer = Buffer.alloc("#!/bin/bash\n##nodescript".length);
    let bufferString = "";
    let filePath;
    let fd;
    for (let file of dir) {
        buffer.fill(0);

        filePath = path.join(aliasFolder, file);

        if (!fs.lstatSync(filePath).isFile()) continue;

        fd = fs.openSync(filePath);
        fs.readSync(fd, buffer, 0, buffer.length, null);
        fs.closeSync(fd);
        bufferString = buffer.toString();

        if (bufferString.includes("nodescript")) scripts.push(file); // is a windows file so include
    }

    return scripts;
}

function commandSelf(args) {
    console.log(`Opening [${aliasFolder}] folder in 'zen'...`);
    zen([]);
}
function commandList(args) {
    let descriptors = JSON.parse(fs.readFileSync(descriptorFile));
    let maxName = Object.keys(descriptors).reduce((a, c) => Math.max(a, c.length), 0);
    for (let d of Object.entries(descriptors).sort()) {
        console.log(d[0].padStart(maxName) + ": " + d[1]);
    }
}
function commandDescriptors(args) {
    console.log(`Opening [${descriptorFile}] in 'zen'...`);
    zen([descriptorFile]);
}
function commandUpdate(args) {
    console.log("Todo item...")
    if (!IS_WIN) commandSwitch({ mode: "win" });
    git("stash", "push");
    git("pull", "origin", "main");
    git("stash", "pop");
    if (!IS_WIN) commandSwitch({ mode: "lin" });
}
function commandSwitch(args) {
    let scripts = getNodeSscripts();
    let dryRun = args.dryRun ? [""] : false;

    console.log("All node scripts:")
    console.log(scripts.map((s) => `  ${s}`).join("\n"));

    process.stdout.write("\x1b[33m" + scripts.map(() => ".").join("") + "\x1b[0m");
    process.stdout.write("\x1b[0G");

    const forceType = args.mode;
    let newType;
    let oldPath;
    let newPath;
    let endsWithCmd;
    for (let script of scripts) {
        endsWithCmd = script.endsWith(".cmd");
        newType = scriptTypes[forceType] ?? 0; // convert to cmd as default
        if (endsWithCmd) newType = scriptTypes[forceType] ?? 1; // end on cmd? convert to bash

        oldPath = path.join(aliasFolder, script);
        let dot = script.lastIndexOf(".");
        newPath = path.join(aliasFolder, newType === 1 ? script.substring(0, dot >= 0 ? dot : undefined) : script + (endsWithCmd ? "" : ".cmd"));

        try {
            if (oldPath === newPath) {
                process.stdout.write("\x1b[34m.\x1b[0m");
                continue;
            }

            if (!dryRun) {
                fs.writeFileSync(oldPath, cmdContents()[newType]);
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
}
function commandCreate(args) {
    let items = [];

    for (let i = 0; i < args.aliases.length; i++) {
        let alias = args.aliases[i];

        const cmdLoc = path.join(aliasFolder, alias + (IS_WIN ? ".cmd" : ""));
        const psLoc = path.join(aliasFolder, alias + ".ps1")
        const jsLoc = path.join(aliasFolder, "js", alias + ".js");

        if (fs.existsSync(cmdLoc)) { // if the cmd exists and the js exists, just open the js
            if (fs.existsSync(jsLoc)) items.push(jsLoc);
            else items.push(cmdLoc);
        } else if (fs.existsSync(psLoc)) { // if the cmd doesn't exist, but the ps1 exists, open that instead
            items.push(psLoc);
        } else {
            fs.writeFileSync(cmdLoc, cmdContents()[+(!IS_WIN)]); // +(!IS_WIN):  If windows, !IS_WIN = False then + coerces to a 0. If Lin, !IS_WIN = True then + coerces to a 1
            fs.writeFileSync(jsLoc, `console.log("Hello, ${alias}");`);
            items.push(jsLoc);

            let descriptors = JSON.parse(fs.readFileSync(descriptorFile));
            descriptors[alias] = descriptors[alias] ?? "\x1b[31m ----- NO DESCRIPTION GIVEN! -----\x1b[0m";
            fs.writeFileSync(descriptorFile, JSON.stringify(descriptors, null, 4));
        }
    }

    zen(items);
}

require("yargs")
    .scriptName("alias")
    .showHelpOnFail(true)
    .command("$0", help.open, (y) => { }, commandSelf)
    .command("$0 [aliases...]", help.create, (y) => { }, commandCreate)
    .command("list", help.list, (y) => { }, commandList)
    .command("descriptors", help.descriptors, (y) => { }, commandDescriptors)
    .command("update", help.update, (y) => { }, commandUpdate)
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
    }, commandSwitch)
    .argv;
