const { send, src } = require("../..");
const { split, Math, nullish, WASD, random } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!unguy", "!despawn", "!putbackinmypokeball", "!ungal", "!despawnshimeji", "!forfeit", "!giveup", "!declareitissoover", "!surrender", "!dishonorabledischarge"];
module.exports.permission = 0;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    if ((await send("gizmo", "despawn", chatter?.twitch?.name))?.[1]) _reply("Unspawned Guy");
    else _reply("invalid target");
    return [0, ""];
}