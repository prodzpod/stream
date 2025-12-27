const { data, src, send } = require("../..");
const { Math } = require("../../common");
const { log, debug } = require("../../commonServer");

module.exports.execute = async (id, x, y) => {
    if (!require("../../index").sockets().includes("gizmo")) return [0, ""];
    // author, color, x, y, icon
    let author = "";
    let color = "#ffffff";
    let pointer = {point: "cursor", click: "cursor"};
    x = Math.clamp(Math.round(Number(x)), 0, 1920);
    y = Math.clamp(Math.round(Number(y)), 0, 1080);
    let isAnonymous = typeof(id) == "string" && (id.startsWith("A") || id.startsWith("U"));
    if (isAnonymous) author = id;
    else {
        let chatter = src().user.identify({ twitch: { id: Number(id) } }) ?? await src().user.initialize(Number(id));
        author = chatter.twitch.name;
        pointer = chatter?.economy?.pointer;
        color = chatter.twitch.color ?? "#ffffff";
    }
    send("gizmo", "gheatclick", author, color, x, y, pointer, isAnonymous ? 1 : 0);
    return [0, ""];
}