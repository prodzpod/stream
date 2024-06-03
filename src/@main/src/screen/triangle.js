const { send } = require("../..");
const { nullish, Math } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!removetriangle"];
module.exports.permission = 0;  
module.exports.execute = (_reply, from, chatter, message, text) => {
    let amount = Math.floor(Math.max(args(text)[0], 1));
    if (!nullish(amount)) amount = 1;
    log("Redeeming:", "removetriangle", amount);
    _reply("removed triangle");
    send("gizmo", "removetriangle", amount); 
    return [0, ""];
}