const { src, send } = require("../..");
const { nullish, Color, idn, atou, utoa } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!test";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let raw = await send("clonktracker", "poll");
    log(JSON.stringify(raw).length)
    log(ret.length, utoa(ret).length);
    return [0, ""];
}