const { send, src } = require("../..");
const { info, download, log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!dlclip";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text);
    log(await send("twitch", "remote", "VIDEO", _args[0]));
    log(await download("https://pub.colonq.computer/~prod/temp.mp4", "temp.mp4"));
    log(await send("twitch", "remote", "VIDEO"));
    return [0, true];
}