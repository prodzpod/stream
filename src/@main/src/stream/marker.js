const { src, data, send } = require("../..");
const { info } = require("../../commonServer");
const { args } = require("../chat/chat");
module.exports.predicate = "!marker";
module.exports.permission = false;
module.exports.execute = (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text);
    info("Starting Stream Sequence");
    let ret = { phase: data().stream.phase + 1 };
    if (_args[0]) ret.category = _args[0];
    if (_args[1]) {
        ret.title = `🌟𝙋𝙕𝙋𝘿🌙 ${_args[1]}`;
        ret.subject = (_args[1].match(/\[[^\]]+\]/)?.[0].slice(1, -1)) ?? 'gizmos';
    }
    data("stream", ret);
    if (_args.length) send("twitch", "info", data().stream.category, data().stream.title);
    module.exports.sendInfo();
    return [0, ""];
}

module.exports.sendInfo = () => {
    send("gizmo", "info", data().stream.subject, data().stream.phase, data().stream.category);
}