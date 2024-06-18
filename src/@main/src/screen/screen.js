const { src, data, send } = require("../..");
const { split, realtype, time, formatTime, formatDate, BigMath, WASD, nullish, filterKey, filterValue } = require("../../common");
const { log } = require("../../commonServer");

module.exports.screenData = chatter => {
    let ret = {};
    ret.id = chatter.twitch.id;
    ret.name = chatter.twitch.name;
    ret.iu = chatter.economy?.iu ?? 0;
    ret.icon = chatter.economy?.icon ?? { icon: "", alt: false, modifier: null };
    ret.icons = chatter.economy?.icons ?? {};
    ret.pointer = chatter.economy?.pointer ?? {};
    ret.pointers = chatter.economy?.pointers ?? {};
    ret.profile = chatter.shimeji?.sprite ?? chatter.twitch.profile_image;
    ret.shimeji = chatter.shimeji ?? {};
    return ret;
}

module.exports.fetch = subject => {
    switch (subject) {
        case "today": return [0, data().stream.subject];
        case "uptime": return [0, [data().stream.start, data().stream.phase]];
        case "stats": return [0, filterValue(data().global, x => nullish(x) !== null)];
    }
    return [1, ""];
}

const INFO_MESSAGES = {
    discord: () => "https://prod.kr/discord",
    screen: () => "https://prod.kr/screen",
    v: () => "https://prod.kr/v",
    lore: () => "https://prod.kr/v/lore",
    help: () => "https://prod.kr/v/lore",
    commands: () => "available commands: `" + Object.values(src()).filter(x => ["array", "string"].includes(realtype(x.predicate))).map(x => typeof x.predicate === "string" ? x.predicate : x.predicate.join("`, `")).join("`, `") + "`",
    command: () => "available commands: `" + Object.values(src()).filter(x => ["array", "string"].includes(realtype(x.predicate))).map(x => typeof x.predicate === "string" ? x.predicate : x.predicate.join("`, `")).join("`, `") + "`",
    insts: () => "available instruments: `sine`, `tri`, `sq50` and `drum`",
    instruments: () => "available instruments: `sine`, `tri`, `sq50` and `drum`",
    inst: () => "available instruments: `sine`, `tri`, `sq50` and `drum`",
    instrument: () => "available instruments: `sine`, `tri`, `sq50` and `drum`",
    test: () => "TEST STREAM: none of this is really done, code is extremely messy, and the stream will most likely end in crashing. be aware!\n\nalso the on screen chat only supports ascii for now",
    today: () => data().stream.phase !== -1 ? `Today we're making [${module.exports.fetch("today")[1]}]!` : "Stream is currently offline. Check out more prod at https://prod.kr/discord !",
    uptime: () => {
        const o = module.exports.fetch("uptime")[1];
        const HOUR = BigInt(1000*60*60); const WEEK = HOUR * 24n * 7n;
        const timezone = BigInt(-new Date("1970-01-01 0:0:0").getTime());
        const nextStream = BigMath.demod(time() - (29n * HOUR), WEEK) + (29n * HOUR) + WEEK - timezone;
        return o[1] !== -1 ? 
            `It's been ${formatTime(BigInt(o[0]), "hhh:mm:ss")} since the broadcast, and its currently phase ${o[1]}!` :
            `Broadcast is currently offline. we go live every ${formatDate(nextStream + timezone, "WWWW H:mm HHH")} (${formatTime(nextStream, time(), "hhh:mm")} away!)`;
    },
    stats: async () => {
        let ret = module.exports.fetch("stats")[1];
        let g = await send("gizmo", "fetch");
        if (g) {
            g = WASD.unpack(g)[0];
            for (let i = 0; i < g.length; i += 2) ret[g[i]] = g[i+1] ?? 0;
        }
        return Object.entries(ret).map(x => `${x[0]}: ${x[1]}`).join("\n");
    },
}
module.exports.predicate = Object.keys(INFO_MESSAGES).map(x => "!" + x);
module.exports.permission = 0;  
module.exports.execute = async (_reply, from, chatter, message, text, reply) => {
    let ret = INFO_MESSAGES[split(text, " ", 1)[0].slice(1).toLowerCase().trim()]();
    if (ret instanceof Promise) ret = await ret;
    _reply(ret);
    return [0, ""];
}