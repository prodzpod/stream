const { send, src, data } = require("../..");
const { split, Math, nullish, WASD, random } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!autospawn", "!autorespawn", "!toggleautospawn", "!toggleautorespawn"];
module.exports.permission = 0;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    chatter.shimeji.autorespawn ??= false;
    chatter.shimeji.autorespawn = !chatter.shimeji.autorespawn;
    data(`user.${chatter.twitch.id}.shimeji.autorespawn`, chatter.shimeji.autorespawn);
    _reply("toggled auto respawn to " + chatter.shimeji.autorespawn);
    return [0, ""];
}