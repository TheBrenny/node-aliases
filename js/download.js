const {normaliseSize} = require("./lib/util");
const fs = require("fs");
let http;
const { URL } = require("url");
const BLOCKS = "▏▎▍▌▋▊▉█";
const ANSI_OFFSET = 2;

const yargs = require("yargs")
	.scriptName("download")
	.command("$0 [options] <document>", "Downloads the document using parallel downloading for max speed!", (y) => {
		y.options({
			"conns": {
				alias: "c",
				default: 3,
				desc: "The amount of connections to use"
			},
			"output": {
				alias: "o",
				desc: "The output file to download to"
			}
		}).positional("document", {
			demandOption: "You must specify a document to download from",
			desc: "The document to download from"
		});
	})
	.showHelpOnFail(true, "Use --help for help");
const args = yargs.argv;

let locTmp = args.document;
if (!locTmp.startsWith("http")) locTmp = "https://" + locTmp;
const FILE_URL = new URL(locTmp);
http = FILE_URL.protocol === "https:" ? require("https") : require("http");
const OUTPUT = args.output ?? (FILE_URL.pathname.split("/").at(-1) || "output.tmp");
const CONNECTIONS = args.conns;

let totalSize = 0;
let currentSize = 0;
let startTime = 0;
let now = 0;

function headRequest(url) {
	// try head first, then revert to grabbing one byte?	
	return fetch(url, {method: "HEAD"})
		.then(
			(r) => r.headers.get("Content-Length"),
			() => fetch(url, {headers:{Range:"bytes=0-1"}}).then((r) => r.headers.get("Content-Range").split("/").at(1))
		)
		.then(parseInt);
}

function downloadRange(url, index, start, end, fd) {
	return new Promise((resolve, reject) => {
		let chunkSize = end - start;
		let count = 0;
		let color = `\x1b[33m`
		let block = " ";

		http.get(url, { headers: { Range: `bytes=${start}-${end}` } }, res => {
			let offset = start;

			res.on("data", chunk => {
				fs.writeSync(fd, chunk, 0, chunk.length, offset);
				offset += chunk.length;
				count += chunk.length;
				currentSize += chunk.length;
				if (count === chunkSize) color = `\x1b[32m`
				block = BLOCKS.at(Math.round((count / chunkSize) * BLOCKS.length));
				now = Date.now()
				process.stdout.write(`\x1b[0G\x1b[${ANSI_OFFSET + 1 + index}C${color}${block}\x1b[0m\x1b[${CONNECTIONS - index + 2}C${Math.floor((currentSize / totalSize) * 100).toString().padStart(3, " ")}% ${(normaliseSize(currentSize/((now-startTime))))}/s\x1b[0J`);
			});

			res.on("end", resolve);
			res.on("error", reject);
		});
	});
}

async function main() {
	const url = new URL(FILE_URL);
	const size = await headRequest(url);
	totalSize = size;
	const chunkSize = Math.ceil(size / CONNECTIONS);
	const fd = fs.openSync(OUTPUT, "w");
	const tasks = [];

	console.log(`File size: ${normaliseSize(size)}. That's ${normaliseSize(chunkSize)} for ${CONNECTIONS} connections.`);
	console.log();
	process.stdout.write(" ".repeat(ANSI_OFFSET) + "|" + " ".repeat(CONNECTIONS) + "|   0%")

	startTime = Date.now();

	for (let i = 0; i < CONNECTIONS; i++) {
		const start = i * chunkSize;
		const end = Math.min(start + chunkSize - 1, size - 1);
		tasks.push(downloadRange(url, i, start, end, fd));
	}

	await Promise.all(tasks);
	fs.closeSync(fd);

	console.log("Download complete");
}

main()
	.then(
		() => process.exit(0),
		(e) => { console.error(e); process.exit(1) }
	);
