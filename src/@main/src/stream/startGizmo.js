const { send, src } = require("../..");
const { info, log, path, error } = require("../../commonServer");
const { spawn } = require("child_process");
let gizmo = null;
module.exports.predicate = "!startgizmo";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    if (!gizmo) {
        gizmo = spawn(path("src/gizmo2/Gizmo/bin/Debug/net9.0/Gizmo.exe"), { cwd: path("src/gizmo2/Gizmo/bin/Debug/net9.0") });
        gizmo.stdout.on("data", x => log(String(x)));
        gizmo.stderr.on("data", x => error(String(x)));
        gizmo.on("spawn", x => log("Gizmo Triggered"));
        gizmo.on("error", error);
    }
    else { gizmo.kill(); gizmo = null; }
    return [0, true];
}
