const hashAlgorithms = [
    "RSA-MD4",
    "MD4",
    "RSA-MD5",
    "MD5",
    "RSA-RIPEMD160",
    "RIPEMD160",
    "RSA-SHA1",
    "SHA1",
    "RSA-SHA1-2",
    "RSA-SHA1",
    "RSA-SHA224",
    "SHA224",
    "RSA-SHA256",
    "SHA256",
    "RSA-SHA3-224",
    "SHA3-224",
    "RSA-SHA3-256",
    "SHA3-256",
    "RSA-SHA3-384",
    "SHA3-384",
    "RSA-SHA3-512",
    "SHA3-512",
    "RSA-SHA384",
    "SHA384",
    "RSA-SHA512",
    "SHA512",
    "RSA-SHA512/224",
    "SHA512-224",
    "RSA-SHA512/256",
    "SHA512-256",
    "RSA-SM3",
    "SM3",
    "BLAKE2b512",
    "BLAKE2s256",
    "SHA3-224",
    "SHA3-256",
    "SHA3-384",
    "SHA3-512",
    "MD4",
    "MD4",
    "MD5",
    "MD5-SHA1",
    "MD5",
    "ripemd",
    "RIPEMD160",
    "RIPEMD160",
    "RIPEMD160",
    "rmd160",
    "RIPEMD160",
    "SHA1",
    "SHA1",
    "SHA224",
    "SHA224",
    "SHA256",
    "SHA256",
    "SHA3-224",
    "SHA3-256",
    "SHA3-384",
    "SHA3-512",
    "SHA384",
    "SHA384",
    "SHA512",
    "SHA512-224",
    "SHA512-224",
    "SHA512-256",
    "SHA512-256",
    "SHA512",
    "SHAKE128",
    "SHAKE256",
    "SM3",
    "SM3",
    "ssl3-md5",
    "MD5",
    "ssl3-sha1",
    "SHA1",
    "whirlpool",
].map((a) => a.toLocaleUpperCase());
const yargs = require("yargs")
    .scriptName("hash")
    .command("$0 [options] <targets..>", "Hash the target files, directories, or strings", (y) => {
        y.options({
            "algorithm": {
                alias: "a",
                default: "SHA256",
                desc: "The hashing algorithm to use",
            },
            "individual": {
                alias: "i",
                // default: false,
                desc: "Hash individual file entries in a directory, or each string passed",
                boolean: true,
                conflicts: ["string"]
            },
            "recursive": { // only valid if "individual" is present
                alias: "r",
                // default: false,
                desc: "Recurse folders when hashing individual entries",
                boolean: true,
                implies: ["individual"],
            },
            "string": {
                alias: "s",
                desc: "Treat the <targets..> as strings instead of files",
                boolean: true,
                conflicts: ["individual"],
            },
            "concatenate": { // only valid if "string" is present
                alias: "c",
                desc: "Concatenates the input strings as one whole input string",
                boolean: true,
                implies: ["string"],
            },
            "quiet": {
                alias: "q",
                desc: "Prints only the hashes and no other info",
                boolean: true,
                default: false,
            }
        }).positional("targets", {
            demandOption: "You must specify a target dir or file",
            desc: "The target file or folder to hash",
            array: true
        });
    })
    .showHelpOnFail(true, "Use --help for help");
const args = yargs.argv;
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { basename } = require("path");

(async () => {
    if (!(hashAlgorithms.includes(args.algorithm.toLocaleUpperCase()))) {
        yargs.showHelp(console.error);
        let longestAlgo = hashAlgorithms.reduce((a, b) => a.length > b.length ? a : b).length;
        let lines = [];
        let line = "";
        for (let algo of hashAlgorithms) {
            algo = algo.padEnd(longestAlgo + 2);
            if ((line + algo).length > yargs.terminalWidth()) {
                lines.push(line.trim());
                line = "";
            }
            line += algo;
        }
        console.error(`\nInvalid hash algorithm "${args.algorithm}". Pick one of:\n${lines.join("\n")}`);
        process.exit(1);
    }
    if (!args.quiet) console.log("Using algorithm: " + args.algorithm);
    if (args.string) {
        let input = args.individual ? args.targets : [args.targets.reduce((a, c) => a + c)];
        (await hashStrings(input, args.algorithm)).forEach((hash, idx) => {
            if (args.quiet) console.log(hash);
            else console.log(`${input[idx]}\n    ${hash}`);
        })
    } else if (args.individual) {
        let files = [];
        if (args.recursive) files = args.targets.map((t) => listFilesRecurse(t)).flat(100);
        else files = args.targets.map((t) => listFiles(t)).flat(100);
        files = files.sort();
        if (!args.quiet) console.log("Files found: " + files.length);

        let proms = files.map((f) => hashFiles([f], args.algorithm).then(h => [f, h]));
        proms = proms.map(p => p.then(([f, h]) => console.log(path.basename(f) + ":\n    " + h)));
    } else {
        let hash = await hashFiles(
            args.targets.map((t) => listFilesRecurse(t)).flat(100).sort(),
            args.algorithm
        );
        if (args.quiet) console.log(hash);
        else console.log(`${args.targets.join(", ")}\n    ${hash}`)
    }
})();

function listFiles(dir, files) {
    files = files ?? [];

    let stat = fs.statSync(dir);
    if (stat.isDirectory()) {
        let curDir = fs.readdirSync(dir)
        for (let d of curDir) {
            let p = path.join(dir, d);
            let s = fs.statSync(p);
            if (!s.isDirectory()) files.push(p);
        }
    } else if (stat.isFile()) {
        files.push(dir);
    }

    return files;
}

function listFilesRecurse(dir, files) {
    files = files ?? [];

    let stat = fs.statSync(dir);
    if (stat.isDirectory()) {
        let curDir = fs.readdirSync(dir)
        for (let d of curDir) {
            listFilesRecurse(path.join(dir, d), files);
        }
    } else if (stat.isFile()) {
        files.push(dir);
    }

    return files;
}

// File list should be sorted in an predictable way!
async function hashFiles(fileList, algorithm) {
    let hex = crypto.createHash(algorithm);

    let prom;
    for (let f of fileList) {
        prom = new Promise((res, rej) => {
            let stream = fs.createReadStream(f);
            stream.pipe(hex, { end: false });
            stream.on("error", (e) => {
                console.error("Error on file " + f);
                console.error(e);
                rej(e);
            });
            stream.on("end", () => {
                stream.unpipe(hex);
                res();
            });
        });

        await prom;
    }

    return hex.digest("hex");
}

async function hashStrings(strings, algorithm) {
    let hex = crypto.createHash(algorithm);

    let proms = [];
    for (let s of strings) {
        let p = new Promise((res, rej) => {
            if (!hex.update(s)) rej(`Something went wrong hashing: '${s}'`)
            res(hex.digest("hex"));
        });
        proms.push(p);
    }

    return await Promise.all(proms);
}