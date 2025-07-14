const { send, src } = require("../..");
const { info, log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!getthumb";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text);
    return [0, await send("twitch", "remote", "IMAGE", _args[0])];
}