const { send, src } = require("../..");
const { split, Math, nullish } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!randomize", "!randomise"];
module.exports.permission = 0;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    await send("gizmo", "randomize", text);
    _reply("done");
    return [0, ""];
}