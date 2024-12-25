const { send, src, data } = require("../..");
const { split, Math, nullish, WASD, random, realtype } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!autospawn", "!autorespawn", "!toggleautospawn", "!toggleautorespawn"];
module.exports.permission = 0;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    chatter.shimeji.autorespawn ??= false;
    var ret = args(text)[0];
    if (realtype(ret) !== "boolean" && realtype(ret) !== "number") ret = !chatter.shimeji.autorespawn;
    chatter.shimeji.autorespawn = !!ret;
    data(`user.${chatter.twitch.id}.shimeji.autorespawn`, chatter.shimeji.autorespawn);
    _reply("toggled auto respawn to " + chatter.shimeji.autorespawn);
    return [0, ""];
}