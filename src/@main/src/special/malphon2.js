const { src, send, data } = require("../..");
const { args } = require("../chat/chat");
module.exports.predicate = "!settitle";
module.exports.permission = (from, chatter) => { return chatter?.twitch?.id === 1070508385; } // brightermalphon
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    send("web", "malphon", "settitle", args(text).join(" "));
    _reply("done!");
    return [0, args(text).join(" ")];
}