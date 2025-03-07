const { src, data, send } = require("../..");
const { time } = require("../../common");
const { info, log } = require("../../commonServer");
const { args } = require("../chat/chat");
module.exports.predicate = "!golive";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text);
    if (!_args.length) return await src().prepare.execute();
    info("Starting Stream Sequence");
    send("gizmo", "startingsoon");
    src().marker.updateInfo(_args[0], _args[1], 0);
    let announcement = _args.slice(2).join("\n");
    send("discord", "send", "1219958741495975936", "@everyone\n" + announcement + "\n\nhttps://prod.kr/live\nhttps://prod.kr/screen", []);
    src().post.execute(() => {}, from, chatter, message, "!post v " + announcement + "\n\nhttps://prod.kr/live\nhttps://prod.kr/screen", []);
    src().obs.start(); src().obs.brb();
    src().startWeekly.start();
    require("../../command/gizmo/windows").reset();
    send("gizmo", "resetwindows");
    return [0, data().stream];
}