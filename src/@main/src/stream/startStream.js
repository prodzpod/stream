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
    send("gizmo", "startingsoon");
    src().marker.updateInfo(_args[0], _args[1], 0);
    send("discord", "send", "1219958741495975936", "@everyone\n" + _args[2] + "\n\nhttps://prod.kr/live\nhttps://prod.kr/screen", []);
    src().obs.start(); src().obs.brb();
    src().startWeekly.start();
    return [0, ""];
}