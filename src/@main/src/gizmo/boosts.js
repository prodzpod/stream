const { send, data } = require("../..");
const { numberish } = require("../../common");
const { args } = require("../chat/chat");

module.exports.predicate = "!boosts";
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let _args = args(text);
    let target = _args[0] ?? chatter.twitch.login;
    target = Object.values(data().user).find(x => x.twitch?.login === target) ?? { twitch: { login: target }};
    let boost1 = 0, boost2 = 0;
    if (!target.twitch.login) {
        let res = send("twitch", "user", target.twitch.id);
        target.twitch.id = res.id;
        target.twitch.login = res.login;
        target.twitch.name = res.display_name;
    }
    if (target.clonkspotting) boost2 = numberish(target.clonkspotting.boost);
    boost1 = numberish(/\(:boost \. (-?\d+)\)/.exec(await (await fetch(`https://api.colonq.computer/api/user/${target.twitch.login}`)).text())?.[1]) ?? null;
    let boost3 = 0;
    if (boost1 === null) boost3 = null;
    else if (boost1 >= 0) boost3 = boost1 + boost2;
    else boost3 = boost1 - boost2;
    _reply(`boost(v2) power for ${target.twitch.name}: ${boost3}(${boost1} ${boost1 < 0 ? "-" : "+"} ${boost2})`);
    return [0, [boost1, boost2, boost3]];
}