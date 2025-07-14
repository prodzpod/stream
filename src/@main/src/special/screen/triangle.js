const { send, src } = require("../..");
const { nullish, Math } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!removetriangle"];
module.exports.permission = true;  
module.exports.execute = async (_reply, from, chatter, message, text) => {
    if (!src().screen.isScreenOn(_reply, chatter, message)) return [1, ""];
    let amount = Math.floor(Math.max(args(text)[0], 1));
    if (!nullish(amount)) amount = 1;
    log("Redeeming:", "removetriangle", amount);
    _reply("removed triangle");
    return [0, await send("gizmo", "removetriangle", amount)];
}