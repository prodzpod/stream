const { send, data } = require("../..");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!!raid"];
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, reply) => {
    let _args = args(text);
    let user = data().user[_args[0]].twitch;
    log("raid recieved:", user.name, _args[0]);
    await send("gizmo", "raid", user.name, _args[1], user.profile ?? "");
    return [0, ""];
}