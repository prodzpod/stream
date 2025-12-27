const { data, src, send } = require("../..");
const { Math } = require("../../common");
const { log, debug } = require("../../commonServer");

module.exports.execute = async (id, x, y) => {
    if (!require("../../index").sockets().includes("gizmo")) return [0, ""];
    x = Math.clamp(Math.round(Number(x)), 0, 1920);
    y = Math.clamp(Math.round(Number(y)), 0, 1080);
    let author = "";
    let isAnonymous = typeof(id) == "string" && (id.startsWith("A") || id.startsWith("U"));
    if (isAnonymous) author = id;
    else {
        let chatter = src().user.identify({ twitch: { id: Number(id) } }) ?? await src().user.initialize(Number(id));
        author = chatter.twitch.name;
    }
    send("gizmo", "gheatrelease", author, x, y);
    return [0, ""];
}