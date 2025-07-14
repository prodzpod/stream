const { data, src } = require("../..");
const { nullish, Math, random, WASD } = require("../../common");
const { args } = require("../chat/chat");

module.exports.predicate = ["!click"];
module.exports.permission = 0;  
module.exports.execute = (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text);
    const x = Math.clamp(Math.round(Number(_args[0])), 0, 1920), y = Math.clamp(Math.round(Number(_args[1])), 0, 1080);
    if (!nullish(x) || !nullish(y)) return [1, ""];
    let txt = ['!window', random(1, 1919), random(1, 1023)];
    if (Math.between(4, x, 182) && Math.between(1030, y, 1076) || Math.between(212, x, 476) && Math.between(1030, y, 1076)) {
        txt.push(`hi ${chatter.twitch.name}!`, "im prodzpod, the most wired shimeji schuber out here.\nfind out more about me and this stream at\nhttps://prod.kr/v and\nhttps://prod.kr/v/lore !");
        _reply("https://prod.kr/v \nhttps://prod.kr/v/lore");
    }
    else if (Math.between(482, x, 746) && Math.between(1030, y, 1076)) {
        txt.push("the only shill", "we have a discord fully connected with this twitch chat!\nim active there all the time, we hang out here\nhttps://prod.kr/discord");
        _reply("https://prod.kr/discord");
    }
    else if (Math.between(752, x, 1452) && Math.between(1030, y, 1076)) {
        txt.push("!today", `today we"re making [${data().stream.subject}]!`);
    }
    else if (Math.between(1772, x, 1916) && Math.between(1030, y, 1076)) {
        txt.push("!uptime", `We"ve been going for ${formatTime(data().stream.start, "hhh:mm:ss")}!\nCurrently we"re in phase ${data().stream.phase}.`);
    }
    else txt = ["!click", x, y];
    return src().pointerXY.execute(_reply, from, chatter, message, WASD.pack(...txt), emote, reply);
}