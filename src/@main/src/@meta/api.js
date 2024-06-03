const { send } = require("../..");
const { args } = require("../chat/chat");

module.exports.predicate = "!api";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, reply) => {
    const ret = await send("twitch", "raw", ...args(text));
    _reply(ret);
    return [0, ""];
}