const { src, send, data } = require("../..");
const { random, Math, numberish, WASD, realtype, split } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");
module.exports.predicate = ["!value", "!values"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let _args = split(text, " ", 2).slice(1);
    switch (_args[0]) {
        case "list":
            return await src().CElink.sendce(_reply, `valueList ${chatter.twitch.login}`);
        case "random":
            return await src().CElink.sendce(_reply, `valueRandom 1`);
        default:
            let v1 = String(_args[0]);
            if (v1.startsWith("0x")) v1 = v1.slice(2); if (v1.startsWith("x")) v1 = v1.slice(1);
            if (realtype(numberish(parseInt(v1, 16))) !== "number") break;
            return await src().CElink.sendce(_reply, `valueChange ${chatter.twitch.login} ${v1} ${_args[1]}`);
    }
    _reply("Usage: `!value list`, `!value random` or `!value <address> <value>`");
    return [1, ""];
}