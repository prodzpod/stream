const { src, send } = require("../..");
const { nullish, Math, random, WASD, numberish } = require("../../common");
const { args } = require("../chat/chat");

module.exports.predicate = ["!camera"];
module.exports.permission = true;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text).filter(x => typeof numberish(x) === "number").map(x => Number(x));
    return [0, await send("gizmo", "camera", _args[0], _args[1], _args[2], _args[3])];
}