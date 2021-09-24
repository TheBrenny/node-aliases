const bossman = require("big-kahuna");
const token = require("rand-token").generate;

const defaultSize = 20;
const charset = {
    lower: "abcdefghijklmnopqrstuvwxyz",
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    num: "0123456789",
    hex: "0123456789ABCDEF"
}

let result = "";

if (bossman.weight == 0) {
    result = token(defaultSize);
} else if (bossman.weight == 1) {
    // size of token
    let size = parseInt(bossman.arg(0));
    if (!isNaN(size)) {
        result = token(size);
    } else {
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
        } else if (bossman.has("--help", "-h")) {
            console.log("");
            console.log("Usage: token [<number> | <option>]");
            console.log("");
            console.log("Options: ");
            console.log("    <number>");
            console.log("          Generates a token of the parsed length");
            console.log("    --guid");
            console.log("    -g");
            console.log("          Generates a GUID formatted token");
            console.log("    --help");
            console.log("    -h");
            console.log("          Displays this help message");
        } else {
            console.log("Bad command. Use --help or -h for help");
        }
    }
}

console.log(result);