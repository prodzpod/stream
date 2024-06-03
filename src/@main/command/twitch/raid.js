const { send, src, data } = require("../..");
const { log } = require("../../commonServer")

module.exports.execute = async (id, name, viewers) => {
    log("raid recieved:", name, id);
    await src().chat.message("twitch", {twitch: {id: id, name: name}}, {}, "!!raid", null);
    await send("gizmo", "raid", name, viewers, data().user[id].twitch.profile ?? "");
    return [0, ""];
}