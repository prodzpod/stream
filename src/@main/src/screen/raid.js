const { send, data } = require("../..");
const { numberish, nullish } = require("../../common");
const { log, warn } = require("../../commonServer");
const { args } = require("../chat/chat");
const { initialize } = require("../chat/user");

module.exports.predicate = ["!!raid"];
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let _args = args(text);
    let user = null;
    if (typeof numberish(_args[0]) === "number") user = data().user[_args[0]]?.twitch.id;
    else user = Object.values(data().user).find(x => x.twitch?.login === _args[0].toLowerCase())?.twitch.id;
    user = (await initialize(user ?? _args[0])).twitch;
    if (nullish(user?.name) === null) { warn("Raid target do not exist!"); return [1, "raid target do not exist"]; }
    let channel = await send("twitch", "channel", user.id)
    log("raid recieved:", user.name, user.id, [channel.game_name], [channel.title], channel.tags);
    await send("gizmo", "raid", user.name, _args[1], user.profile ?? "");
    return [0, ""];
}