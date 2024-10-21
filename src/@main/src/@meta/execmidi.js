const { send } = require("../..");
const { split } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!execmidi";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let _args = args(text);
    let ret = await send("fl", "send", _args[0], _args[1], _args[2] ?? 0);
    _reply(ret);
    return [0, ""];
}