// This is no longer used because we need cross-platform capability - we use a ps1 because bash has base64 built in

async function run(args) {
    if (args.string === "-") {
        if (!process.stdin.readable) {
            console.error("Cannot read from STDIN");
            process.exit(2);
        }
        args.string = "";
        for await (const chunk of process.stdin) args.string += chunk;
        if (args.string === null) {
            console.error("STDIN returned null");
            process.exit(3);
        }
        if (args.string === "") {
            console.error("STDIN was empty");
            process.exit(4);
        }
    }

    if (args.encode) console.log(btoa(args.string));
    else if (args.decode) console.log(atob(args.string));
    else {
        console.error("How did we get here?");
        process.exit(1);
    }
}

require("yargs")
    .scriptName("base64")
    .showHelpOnFail(true)
    .command("$0 [string]", "Encode or decode a string to or from base64", (y) => {
        y.positional("string", {
            type: 'string',
            array: true,
            describe: "The string to encode or decode ('-' reads from STDIN)",
            default: "-"
        }).check((args) => {
            if (args._.length > 0) return `Can only operate on one string at a time - found dangling [${args._.map((a) => `"${a}"`).join(", ")}]`;
            return true;
        });
    }, run)
    .help()
    .options({
        encode: {
            alias: "e",
            type: "boolean",
            description: "Encode the incoming string",
            conflicts: "decode",
        },
        decode: {
            alias: "d",
            type: "boolean",
            description: "Decode the incoming string",
            conflicts: "encode",
        },
    })
    .check((args) => {
        if (args.decode === args.encode) return "Encode or decode must be specified, but not both"
        return true;
    }, true)
    .alias("help", "h")
    .argv;
