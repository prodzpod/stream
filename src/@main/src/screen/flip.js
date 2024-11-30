const { send } = require("../..");

module.exports.predicate = ["!flip", "!flop"];
module.exports.permission = true;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    await send("gizmo", "flip");
    _reply("flipped");
    return [0, true];
}