const { send, src } = require("../..");

module.exports.predicate = ["!flip", "!flop"];
module.exports.permission = true;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    if (!src().screen.isScreenOn(_reply)) return [1, ""];
    await send("gizmo", "flip");
    _reply("flipped");
    return [0, true];
}