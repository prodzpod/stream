const { send } = require("../..");
const { WASD } = require("../../common");
const { info } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!api";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text);
    let ret = await send("twitch", "raw", ...args(text));
    if (typeof ret === "object") ret = WASD.pack(ret);
    if (_args[4] == "silent") info(ret);
    else _reply(ret);
    return [0, ""];
}