const { send, src } = require("../..");
const { info, log } = require("../../commonServer");
module.exports.predicate = ["!mute", "!unmute"];
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    send("obs", "send", "SetSceneItemEnabled", "stream::audio", "voice", {"sceneItemEnabled": text.startsWith("!unmute") ? true : false});
    return [0, true];
}
