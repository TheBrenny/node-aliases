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
    "id-rsassa-pkcs1-v1_5-with-sha3-224",
    "SHA3-224",
    "id-rsassa-pkcs1-v1_5-with-sha3-256",
    "SHA3-256",
    "id-rsassa-pkcs1-v1_5-with-sha3-384",
    "SHA3-384",
    "id-rsassa-pkcs1-v1_5-with-sha3-512",
    "SHA3-512",
    "MD4",
    "md4WithRSAEncryption",
    "MD4",
    "MD5",
    "MD5-SHA1",
    "md5WithRSAEncryption",
    "MD5",
    "ripemd",
    "RIPEMD160",
    "RIPEMD160",
    "ripemd160WithRSA",
    "RIPEMD160",
    "rmd160",
    "RIPEMD160",
    "SHA1",
    "sha1WithRSAEncryption",
    "SHA1",
    "SHA224",
    "sha224WithRSAEncryption",
    "SHA224",
    "SHA256",
    "sha256WithRSAEncryption",
    "SHA256",
    "SHA3-224",
    "SHA3-256",
    "SHA3-384",
    "SHA3-512",
    "SHA384",
    "sha384WithRSAEncryption",
    "SHA384",
    "SHA512",
    "SHA512-224",
    "sha512-224WithRSAEncryption",
    "SHA512-224",
    "SHA512-256",
    "sha512-256WithRSAEncryption",
    "SHA512-256",
    "sha512WithRSAEncryption",
    "SHA512",
    "SHAKE128",
    "SHAKE256",
    "SM3",
    "sm3WithRSAEncryption",
    "SM3",
    "ssl3-md5",
    "MD5",
    "ssl3-sha1",
    "SHA1",
    "whirlpool",
];
const yargs = require("yargs")
    .scriptName("hash")
    .showHelpOnFail(true)
    .command("$0 [options] <target..>", "Generate a hash a target file or directory", (y) => {
        y.options({
            "algorithm": {
                alias: "a",
                default: "sha256",
                desc: "The hashing algorithm to use",
            },
            "individual": {
                alias: "i",
                default: false,
                desc: "Hash individual file entries in a directory",
                boolean: true
            },
            "recursive": {
                alias: "r",
                default: false,
                desc: "Recurse folders when hashing individual entries",
                boolean: true,
                demandOption: "individual"
            },
        }).positional("target", {
            demandOption: "You must specify a target dir or file",
            desc: "The target file or folder to hash",
            array: true
        });
    }).argv;

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { basename } = require("path");

(async () => {
    console.log("Using algorithm: " + yargs.algorithm);
    if (yargs.individual) {
        const SPACE_PADDING = 2;
        let files = [];
        if (yargs.recursive) files = yargs.target.map((t) => listFilesRecurse(t)).flat(100);
        else files = yargs.target.map((t) => listFiles(t)).flat(100);
        files = files.sort();
        console.log("Files found: " + files.length);

        let proms = files.map((f) => hashFiles([f], yargs.algorithm).then(h => [f, h]));
        proms = proms.map(p => p.then(([f, h]) => console.log(path.basename(f) + ":\n    " + h)));
    } else {
        console.log(
            await hashFiles(
                yargs.target.map((t) => listFilesRecurse(t)).flat(100).sort(),
                yargs.algorithm
            )
        )
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
