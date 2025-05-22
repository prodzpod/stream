const { src, send } = require("../..");
const { nullish, Math, random, WASD, numberish } = require("../../common");
const { args } = require("../chat/chat");

module.exports.predicate = ["!camera"];
module.exports.permission = true;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    if (!src().screen.isScreenOn(_reply, chatter, message)) return [1, ""];
    let arg = args(text)[0];
    if (arg === "reset") arg = {"reset": 0}
    return [0, await send("gizmo", "camera", arg)];
}