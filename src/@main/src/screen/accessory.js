const { send, src } = require("../..");
const { split, Math, nullish } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!accessory", "!accessories"];
module.exports.permission = 0;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let _args = args(text);
    if (_args.length === 0) {
        let res = await send("gizmo", "previousaccessories");
        _reply("Available Accessories: " + res.join(", "));
        return [0, ""];
    }
    if (_args[0].toLowerCase() === "reset") _args[0] = null;
    let res = await send("gizmo", "toggleaccessory", _args[0]?.toLowerCase());
    _reply(res[0]);
    return [0, ""];
}