const { src, send, data, incrementData } = require("../..");
const { random, Math, numberish, WASD, time, nullish, BigMath, unique, randomHex, realtype } = require("../../common");
const { log, path } = require("../../commonServer");
const { args } = require("../chat/chat");
module.exports.predicate = "!gift";
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text);
    let type = PRICES.filter(x => x[0].includes(String(_args[0])?.toLowerCase().trim()));
    if (!type?.length) {
        _reply("available gifts: `" + PRICES.filter(x => !x[0].includes("bijan")).map(x => x[0][0]).join("`, `") + "`");
        return [1, ""];
    }
    type = random(type);
    let amount = numberish(_args[1]); if (realtype(amount) !== "number") amount = 1;
    if (amount <= 0) {
        _reply("The Gifts are not for you to take.");
        return [1, ""];
    }
    if (chatter.economy?.iu < type[1] * amount) {
        _reply(`You need ${type[1] * amount} iu to send this gift. (Currently has ${chatter.economy.iu} iu)`);
        return [1, ""];
    }
    let target = [
        ["prodzpod", "prodzpod"], 
        ["lala_amanita", "lala_amanita"], 
        ["BrighterMalphon", "brightermalphon"], 
        ["Northernlion", null], 
        ["BugVT", "bugvt"], 
        ["SaladForrest", "saladforrest"], 
        ["LCOLONQ", "lcolonq"], 
        ["women", null], 
        ["gaypeople", null],
        ["j_blow", null],
        ["sus1d1p", "sus1d1p"],
        ["Noneuclidean", "noneuclidean"],
    ];
    const _time = time();
    const users = Object.values(data().user).filter(chatter => nullish(chatter.meta?.last_interacted) !== null && (chatter.economy?.weekly ?? 0n) > (_time - BigInt(7*1000*60*60*24)));
    target = [...target, ...users.map(x => [x.twitch.name, x.twitch.login])];
    if (src().screen.isScreenOn(_reply, chatter, message)) {
        const guys = (await send("gizmo", "fetch", "guys"))[0];
        target = [...target, ...guys.map(x => [x + "'s Guy", Object.values(data().user).find(y => y.twitch?.name === x)])];
    }
    const _target = random(unique(target.map(x => x[1])));
    const __target = random(target.filter(x => x[1] === _target));
    if (type[0][0] === "seal" && amount >= 1) { src().sealpost.execute(() => {}, from, chatter, message, text, emote, reply); }
    _reply(`Sent ${amount} ${type[0][0][0].toUpperCase()}${type[0][0].slice(1)} to ${__target[0]}!`);
    incrementData(`user.${chatter.twitch.id}.economy.iu`, -type[1] * amount);
    if (__target[1]) {
        const id = Object.values(data().user).find(x => x.twitch?.login === __target[1]).twitch.id;
        incrementData(`user.${id}.economy.iu`, type[1] * amount);
        const _data = {};
        _data[type[0][0]] = (data().user[id].economy.gifts?.[type[0][0]] ?? 0) + 1;
        data(`user.${id}.economy.gifts`, _data);
    }
    send("gizmo", "gift", `<emote=${path(type[2])}>`, type[1], amount);
    return [0, "hi"];
}

const PRICES = [
    [["icecream", "ice cream", "yumyum"], 1, "src/@main/data/emote/vanilla/twemoji/assets/72x72/1f366.png"],
    [["rose", "flower", "lovely", "forme"], 1, "src/@main/data/emote/vanilla/twemoji/assets/72x72/1f339.png"],
    [["hotdog", "glizzy"], 5, "src/@main/data/emote/vanilla/twemoji/assets/72x72/1f32d.png"],
    [["seal"], 400, "src/@main/data/emote/vanilla/twemoji/assets/72x72/1f9ad.png"],
    [["galaxy"], 1000, "src/@main/data/emote/vanilla/twemoji/assets/72x72/1f30c.png"],
    [["meteor", "meteor happens", "meteorhappens", "bigbang", "big bang", "pangrea"], 3000, "src/@main/data/emote/vanilla/twemoji/assets/72x72/2604.png"],
    [["lion"], 30000, "src/@main/data/emote/vanilla/twemoji/assets/72x72/1f981.png"],
    [["fish", "jol", "joel"], 10000, "src/@main/data/emote/7tv/Joel.gif"],
    [["croissant", "bijan"], 100, "src/@main/data/emote/vanilla/twemoji/assets/72x72/1f950.png"],
    [["baguette", "bijan"], 100, "src/@main/data/emote/vanilla/twemoji/assets/72x72/1f956.png"],
    [["pie", "bijan"], 100, "src/@main/data/emote/vanilla/twemoji/assets/72x72/1f967.png"],
    [["pretzel", "bijan"], 100, "src/@main/data/emote/vanilla/twemoji/assets/72x72/1f968.png"],
    [["biscuit", "bijan"], 100, "src/@main/data/emote/vanilla/twemoji/assets/72x72/1fad3.png"],
    [["donut", "bijan"], 100, "src/@main/data/emote/vanilla/twemoji/assets/72x72/1f369.png"],
    [["cake", "bijan"], 100, "src/@main/data/emote/vanilla/twemoji/assets/72x72/1f370.png"],
    [["sandwich", "bijan"], 100, "src/@main/data/emote/vanilla/twemoji/assets/72x72/1f96a.png"],
    [["coffee", "bijan"], 100, "src/@main/data/emote/vanilla/twemoji/assets/72x72/2615.png"],
];