const { send, src } = require("../..");
const { info } = require("../../commonServer");

module.exports.predicate = "!brb";
module.exports.permission = false;
module.exports.execute = (_reply, from, chatter, message, text, emote, reply) => {
    info("Toggling BRB");
    src().obs.brb();
    send("gizmo", "brb");
    return [0, ""];
}