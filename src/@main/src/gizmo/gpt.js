const { send } = require("../..");
const { args } = require("../chat/chat");

module.exports.predicate = "!gpt";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const ret = await send("gpt", "ask", ...args(text));
    _reply(ret);
    return [0, ret];
}