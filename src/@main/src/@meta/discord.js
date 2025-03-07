const { send } = require("../..");
const { split } = require("../../common");

module.exports.predicate = "!execdiscord";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let ret = await send("discord", "exec", split(text, /\s+/, 1)[1] ?? "");
    _reply(ret);
    return [0, ret];
}