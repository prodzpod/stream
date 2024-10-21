const { src, send } = require("../..");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!test";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    for (let k of ["ror2", "bepin", "assetstudio", "ilspy", "unity", "r2modman"]) {
        log(k, await send("obs", "send", "GetInputSettings", {"inputName": k}));
    }
    return [0, ""];
}