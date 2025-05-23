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
    open: "Opens the alias folder in zen mode and creates the aliases specified.",
    create: "Creates two files: name.cmd and js\\name.js. The cmd file contains default text to execute the js file in the Node runtime. The js file contains a 'Hello, name' console command used as a starting point for the js program to function. Zen mode is subsequently opened to the alias folder and the js file.",
    list: "Lists all aliases and their descriptions.",
    descriptors: "Opens the descriptor file for modifications.",
    switch: "Switches all eligible .cmd/.sh scripts into the opposite operating system. Ie, from Batch to Bash and vice verser. A script is eligible when it has `nodescript` in the first 25 characters.",
    switchLangDryRun: "[switch] Runs --switch-lang in dry run mode.",
    switchType: "[switch] Specifies which type to convert all aliases to",
    folder: "Prints the current aliasFolder location",
    update: "Updates the aliases to the latest version",
    help: "Shows this help page",
}

function getNodeScripts() {
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
    if (args.list) return commandList();
    else if (args.descriptors) return commandDescriptors();
    else if (args.update) return commandUpdate();
    else if (args.switch) return commandSwitch({ mode: args.mode, dryRun: args.dryRun });
    else if (args.folder) return console.log(aliasFolder);
    else if (args.aliases?.length > 0) return commandCreate(args.aliases);
    else {
        console.log(`Opening [${aliasFolder}] folder in 'zen'...`);
        zen([]);
    }
}
function commandCreate(aliases) {
    let items = [];

    for (let i = 0; i < aliases.length; i++) {
        let alias = aliases[i];

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

    console.log(`Opening ${items.length} items in 'zen'...`)
    zen(items);
}
function commandList() {
    let descriptors = JSON.parse(fs.readFileSync(descriptorFile));
    let maxName = Object.keys(descriptors).reduce((a, c) => Math.max(a, c.length), 0);
    for (let d of Object.entries(descriptors).sort()) {
        console.log(d[0].padStart(maxName) + ": " + d[1]);
    }
}
function commandDescriptors() {
    console.log(`Opening [${descriptorFile}] in 'zen'...`);
    zen([descriptorFile]);
}
function commandUpdate() {
    console.log("Todo item...")
    if (!IS_WIN) commandSwitch({ mode: "win" });
    git("stash", "push");
    git("pull", "--rebase", "origin", "main");
    git("stash", "pop");
    if (!IS_WIN) commandSwitch({ mode: "lin" });
}
function commandSwitch(args) {
    let scripts = getNodeScripts();
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

require("yargs")
    .scriptName("alias")
    .showHelpOnFail(true)
    .command("$0 [aliases..]", help.open, (y) => {
        y.positional("aliases", {
            type: 'string',
            array: true,
        });
    }, commandSelf)
    .options({
        folder: {
            alias: "f",
            type: "boolean",
            default: false,
            description: help.folder,
        },
        list: {
            alias: "l",
            type: "boolean",
            default: false,
            description: help.list,
        },
        descriptors: {
            alias: "d",
            type: "boolean",
            default: false,
            description: help.descriptors,
        },
        update: {
            alias: "u",
            type: "boolean",
            default: false,
            description: help.update,
        },
        switch: {
            alias: "s",
            type: "boolean",
            default: false,
            description: help.switch
        },
        dryRun: {
            boolean: true,
            description: help.switchLangDryRun
        },
        mode: {
            choices: ["win", "lin"],
            description: help.switchType,
        }
    })
    .alias("help", "h")
    .group(["dryRun", "mode"], "Switch options:")
    .argv;
