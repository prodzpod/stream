const { data } = require("../..");
const { WASD, Math, nullish } = require("../../common");
const { log } = require("../../commonServer");
const { args, chat } = require("../chat/chat");

module.exports.predicate = ["!stats", "!stat", "!statistics", "!statistic", "!evspread"];
module.exports.permission = 0;  
module.exports.execute = async (_reply, from, chatter, message, text) => {
    let _args = args(text);
    let target;
    if (nullish(_args[0]) !== null) {
        _args[0] = _args[0].trim().toLowerCase();
        target = Object.values(data().user).find(x => x.twitch?.login.toLowerCase() === _args[0] || x.twitch?.name.toLowerCase() === _args[0] || x.twitch?.id === _args[0] || x.discord?.id === _args[0] || x.discord?.name.toLowerCase() === _args[0]);
        if (nullish(target) === null) return "Could not find chatter";
    } else target = chatter;    
    _reply(target.twitch.name + "'s guy: \n" + module.exports.calculate(target.twitch.id).join(", \n"));
    return [0, ""];
}

module.exports.calculate = (id) => {
    let ai = data().user[id].shimeji.ai;
    let average = module.exports.calculateAverage();
    let txt = [];
    for (let k in ai) {
        let percentage = typeof ai[k] === "object";
        let value = percentage ? ai[k].value / ai[k].max : ai[k];
        let percentageify = v => percentage ? (Math.prec(v * 100, 2) + "%") : Math.prec(v, 2);
        txt.push(`${k}: ${percentageify(value)} (${(value - average[k] > 0 ? "+" : "") + percentageify(value - average[k])})`);
    }
    return txt;
}

module.exports.calculateAverage = () => {
    let ai = {}; let count = 0;
    for (let k of Object.values(data().user)) {
        if (!k?.shimeji?.ai) continue;
        for (let k2 in k.shimeji.ai) {
            ai[k2] ??= {max: 0, value: 0};
            let d = k.shimeji.ai[k2];
            if (typeof d === "object") {
                ai[k2].max += d.max;
                ai[k2].value += d.value;
            } else {
                ai[k2].max += 1;
                ai[k2].value += d;
            }
        }
        count++;
    }
    for (let k in ai) ai[k] = ai[k].value / ai[k].max;
    return ai;
}