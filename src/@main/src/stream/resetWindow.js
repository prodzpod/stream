const { send, src } = require("../..");
const { info } = require("../../commonServer");

module.exports.predicate = ["!resetwindows", "!restartwindows", "!refreshwindows", "!resetwindow", "!restartwindow", "!refreshwindow"];
module.exports.permission = false;
module.exports.execute = (_reply, from, chatter, message, text, emote, reply) => {
    info("Resetting Windows");
    require("../../command/gizmo/windows").reset();
    send("gizmo", "resetwindows");
    _reply("Reset Windows");
    return [0, true];
}