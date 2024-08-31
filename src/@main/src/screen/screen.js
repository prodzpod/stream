const { src, data, send } = require("../..");
const { split, realtype, time, formatTime, formatDate, BigMath, nullish, filterValue, random, String, Math } = require("../../common");
const { log, listFiles, path } = require("../../commonServer");
const { checkPerms } = require("../chat/chat");

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
    ret.isProd = chatter.twitch.login === "prodzpod";
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

const getCommands = (from, chatter, message, text, emote, reply) => "available commands: `"
 + Object.values(src())
    .filter(x => 
        ["array", "string"].includes(realtype(x.predicate))
        && x.predicate.length > 0
        && checkPerms(x.permission, from, chatter, message, text, emote, reply))
    .map(x => typeof x.predicate === "string" ? [x.predicate] : x.predicate)
    .flat().sort().join("`, `")
 + "`";
const getInsts = async () => `available instruments: \`${
    (await listFiles("src/gizmo2/Gizmo/StreamOverlay/@Content/instruments"))
    .filter(x => x.endsWith(".instrument.properties"))
    .map(x => x.slice(0, -".instrument.properties".length))
    .join("`, `")}\``;
const getFonts = async () => `available fonts: \`${
    (await listFiles("src/gizmo2/Gizmo/StreamOverlay/@Content/@font"))
    .filter(x => x.endsWith(".font.properties"))
    .map(x => x.slice(0, -".font.properties".length))
    .join("`, `")}\``;
const getInfo = (from, chatter, message, text, emote, reply) => `iu: ${chatter.economy.iu}`;

const INFO_MESSAGES = {
    discord: () => "https://prod.kr/discord",
    screen: () => "https://prod.kr/screen",
    v: () => "https://prod.kr/v",
    lore: () => "https://prod.kr/v/lore",
    help: () => "https://prod.kr/v/lore",
    irc: () => "https://prod.kr/discord is also connected to IRC @ colonq.computer:26697 (over TLS) courtesy of the male @LCOLONQ - `/join #prodarea` after connecting",
    commands: getCommands,
    command: getCommands,
    insts: getInsts,
    instruments: getInsts,
    inst: getInsts,
    instrument: getInsts,
    font: getFonts,
    fonts: getFonts,
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
        if (g) for (let i = 0; i < g.length; i += 2) ret[g[i]] = g[i+1] ?? 0;
        return Object.entries(ret).map(x => `${x[0]}: ${x[1]}`).join("\n");
    },
    gcp: async () => {
        function getEmote(v) {
            if (v > 99) return "🌐";
            if (v > 95) return "🟣";
            if (v > 90) return "🔵";
            if (v > 40) return "🟢";
            if (v > 10) return "🟡";
            if (v > 5) return "🟠";
            if (v > 1) return "🔴";
            return "‼️";
        }
        function getText(v) {
            if (v > 95) return "significantly small";
            if (v > 90) return "small";
            if (v > 40) return "normal";
            if (v > 10) return "slightly increased";
            if (v > 5) return "strongly increased";
            return "significantly large";
        }
        function coherence(...args) {
            if (args.length < 1) return 100;
            let ret = 0;
            for (let i = 0; i < args.length; i++) for (let j = i + 1; j < args.length; j++)
                ret += 100 - Math.abs(args[i] - args[j]);
            return ret / (args.length * (args.length - 1));
        }
        let global = data().global;
        let _gcp3 = (await module.exports.updateGCP())[1] * 100; // trigger this even after gcp3 is real
        let c = coherence(global.gcp, global.gcp2, _gcp3);
        return `${getEmote(global.gcp)} The network variance is ${getText(global.gcp)}. (${Math.prec(global.gcp)}%, gcp2: ${getEmote(global.gcp2)} ${Math.prec(global.gcp2)}%, gcp3*: ${getEmote(_gcp3)} ${Math.prec(_gcp3)}%, coherence: ${getEmote(c)} ${Math.prec(c)}%)`
    },
    inv: getInfo,
    inventory: getInfo,
    me: getInfo,
    wallet: getInfo
}
module.exports.predicate = Object.keys(INFO_MESSAGES).map(x => "!" + x);
module.exports.permission = 0;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let ret = INFO_MESSAGES[split(text, " ", 1)[0].slice(1).toLowerCase().trim()](from, chatter, message, text, emote, reply);
    if (ret instanceof Promise) ret = await ret;
    _reply(ret);
    return [0, ""];
}

const fs = require("fs");
const excludedTypes = ["node_modules/", "external/"]
const fileTypes = [".js", ".cs", ".pug", ".css", ".wasd", ".bat", ".gitignore", ".gitmodules"]
module.exports.updateGCP = async () => {
    let v = data().global._gcp3;
    let files = random((await listFiles()).filter(x => fileTypes.some(y => x.endsWith(y)) && !excludedTypes.some(y => x.includes(y))));
    let file = fs.readFileSync(path(files)).toString().replace(/\s+/g, "");
    let ch = file[Math.floor(random(0, file.length))];
    v = ((v << 1) + (v & 0x1)) ^ String.hashCode(ch ?? " ");
    data("global._gcp3", v);
    let ret = (v / (1 << 31) + 1) / 2;
    log(`[GCP3] Pulled a ${ch} from ${files}! (${Math.prec(ret * 100)}%)`);
    return [ch, ret];
}