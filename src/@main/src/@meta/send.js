const { send } = require("../..");
const { args } = require("../chat/chat");

module.exports.predicate = "!send";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    return await send(...args(text));
}