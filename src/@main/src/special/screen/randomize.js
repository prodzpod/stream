const { send, src } = require("../..");
const { split, Math, nullish } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!randomize", "!randomise"];
module.exports.permission = true;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    if (!src().screen.isScreenOn(_reply, chatter, message)) return [1, ""];
    _reply("done");
    return [0, await send("gizmo", "randomize", text)];
}