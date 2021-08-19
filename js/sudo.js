const sudo = require('sudo-prompt');

let command = process.argv.slice(2).map(e => `"${e}"`).join(" ");

sudo.exec(command, {
    name: "sudo",
}, (e, out, err) => {
    if (e) console.error(e);
    else if (err) console.error(err);
    else console.log(out);
});