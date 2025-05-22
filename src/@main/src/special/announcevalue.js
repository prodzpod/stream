const { src, send, data } = require("../..");
const { WASD } = require("../../common");
module.exports.predicate = "!announcevalue";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const users = Object.values(data().user).filter(x => x?.special?.value !== undefined && x?.special?.value > 0);
    let ret = {};
    for (const x of users) {
        const from = x.special.lastValue ?? x.special.value;
        const to = x.special.value;
        const percentage = (to - from) / from * 100;
        ret[x.twitch.login] = [to, percentage];
        data(`user.${x.twitch.id}.special`, { lastValue: to });
    }
    send("web", "priceoverlay", WASD.pack(ret));
    return [0, ret];
}