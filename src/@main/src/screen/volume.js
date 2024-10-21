const { send } = require("../..");
const { nullish, Math, numberish } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!volume";
module.exports.permission = 0;  
module.exports.execute = (_reply, from, chatter, message, text) => {
    let amount = numberish(args(text)[0]);
    if (typeof amount !== "number") amount = 100;
    amount = Math.clamp(amount, 0, 100);
    send("gizmo", "volume", amount); 
    _reply("set volume");
    return [0, ""];
}