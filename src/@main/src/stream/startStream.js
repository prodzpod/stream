const { src, data, send } = require("../..");
const { time } = require("../../common");
const { info } = require("../../commonServer");
const { args } = require("../chat/chat");
module.exports.predicate = "!golive";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text);
    if (!_args.length) return await src().prepare.execute();
    info("Starting Stream Sequence");
    data("stream", {
        category: _args[0],
        title: `🌟𝙋𝙕𝙋𝘿🌙 ${_args[1]}`,
        subject: (_args[1].match(/\[[^\]]+\]/)?.[0].slice(1, -1)) ?? 'gizmos',
        start: time(),
        phase: 0
    });
    send("twitch", "info", data().stream.category, data().stream.title);
    send("discord", "send", "1219958741495975936", "@everyone\n" + _args[2] + "\n\nhttps://prod.kr/live\nhttps://prod.kr/screen", []);
    src().obs.start(); src().obs.brb();
    send("gizmo", "startingsoon");
    src().marker.sendInfo();
    src().startWeekly.start();
    return [0, ""];
}