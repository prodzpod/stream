const { send, src } = require("../..");
const { split, Math, nullish } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!palette", "!color", "!swap"];
module.exports.permission = 0;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let _args = args(text);
    if (_args.length === 0) {
        let res = await send("gizmo", "previouscolor");
        _reply("Available Colors: " + res.join(", "));
        return [0, ""];
    }
    if (_args[0].toLowerCase() === "reset") _args[0] = null;
    if (PALETTE[_args[0]]) _args[0] = PALETTE[_args[0]];
    let res = await send("gizmo", "colorreplace", _args[0], _args[1]);
    _reply(res[0]);
    return [0, ""];
}

const PALETTE = {
    "Black": "#000000",
    "White": "#FFFFFF",
    "Blush": "#F9FFB2",
    "Hair": "#FF9800",
    "Skin": "#FFD253",
    "Mouth": "#CC8787",
    "Ribbon": "#000001",
    "Ribbon(Inner)": "#FEFEFE",
    "Clothes": "#0066FF",
    "Arms": "#FFC943",
    "Socks": "#010000",
    "Transparent": "#00000000",
}