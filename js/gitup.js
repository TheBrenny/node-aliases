const cp = require("child_process");
const exec = cp.execSync;
const spawn = cp.spawn;

try {
    let branch = exec("git branch").toString().split("\n");
    branch = branch.find(b => b.startsWith("*"));
    branch = branch.substring(2);

    let upstream = exec("git remote").toString().split("\n")[0];
    if (upstream.length === 0) throw new Error("upstream not found");

    let proc = spawn(`git`, ["push", "--set-upstream", upstream, branch], {
        shell: true,
        stdio: "inherit"
    });

    proc.on('close', (code) => process.exit(code));
} catch (e) {
    console.error("Something went wrong:")
    process.stderr.write(e.toString());
    process.stderr.write("\n");
    process.exit(e.code ?? 1);
}