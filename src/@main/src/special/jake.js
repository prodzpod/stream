const { src, send } = require("../..");
const { args } = require("../chat/chat");
let jakingout = null;
module.exports.predicate = "!jakeout";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let off = args(text)[0] === "off";
    if (off && jakingout) clearInterval(jakingout);
    else if (!jakingout) jakingout = setInterval(() => { send("web", "ws", "jake", "keepalive"); }, 4800);
    _reply("done!");
    return [0, ""];
}