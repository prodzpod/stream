const { send, src } = require("../..");
const { nullish, Math, numberish } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!volume";
module.exports.permission = true;  
module.exports.execute = async (_reply, from, chatter, message, text) => {
    if (!src().screen.isScreenOn(_reply)) return [1, ""];
    let _args = args(text);
    log(_args);
    if (!_args[0]) { _reply("audio categories: system, message, click, window, song, kick, gong, speech"); return [0, ""]; }
    let amount = numberish(_args[_args.length - 1]);
    if (typeof amount !== "number") amount = 100;
    amount = Math.clamp(amount, 0, 100);
    _reply("set volume");
    return [0, await send("gizmo", "volume", amount, _args[1] ? _args[0] : "")];
}