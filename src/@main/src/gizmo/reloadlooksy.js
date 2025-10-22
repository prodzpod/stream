const fs = require("fs")
const { log, listFiles, path, error } = require("../../commonServer");
const { spawn, execFile, execFileSync } = require("child_process");

module.exports.predicate = ["!rl", "!cl", "!reloadlooksy"];
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let { stderr, stdout } = spawn("npx", ["tsc"], {shell: true, cwd: path("external/@web/witness/public/ts")});
    stdout.on("data", d => log(d.toString()));
    stderr.on("data", d => error(d.toString()));
    _reply("compile successful!");
    return [0, ""];
}