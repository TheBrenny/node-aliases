const bossman = require("big-kahuna");
const token = require("rand-token").generate;

const defaultSize = 20;
const charset = {
    lower: "abcdefghijklmnopqrstuvwxyz",
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    num: "0123456789",
    hex: "0123456789ABCDEF",
    symbolssub: "~!@#$%&*-_=+.>?",
    symbolsext: "`^()[{]}\\|;:'\",<>/"
}

if (bossman.has("--help", "-h")) {
    let usage = [
        "",
        "Usage: token [number] [option]",
        "",
        "Options: ",
        "    [number]",
        "          Generates a token of the parsed length",
        "    --guid",
        "    -g",
        "          Generates a GUID formatted token",
        "    -p",
        "    --pass",
        "    --password",
        "          Generates a (non-crypto) random string of alphanumeric + special chars",
        "    --help",
        "    -h",
        "          Displays this help message",
    ];
    usage.forEach((l) => console.log(l));
    console.log();
    process.exit(0);
}

let result = "";

if (bossman.weight == 0) {
    result = token(defaultSize);
} else if (bossman.weight >= 1) {
    // size of token
    let size = defaultSize;
    if (!isNaN(parseInt(bossman.arg(0)))) {
        size = parseInt(bossman.arg(0))
    }

    if (bossman.has("--guid", "-g")) {
        result = token(32, charset.hex.toLowerCase());
        result = [
            result.substring(0, 8),
            result.substring(8, 12),
            result.substring(12, 16),
            result.substring(16, 20),
            result.substring(20)
        ];
        result = result.join("-");
    } else if (bossman.has("--password", "--pass", "-p")) {
        result = token(size, (charset.lower + charset.upper + charset.num + charset.symbolssub));
    } else {
        result = token(size);
    }
}

console.log(result);