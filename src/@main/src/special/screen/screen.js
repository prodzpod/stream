const { src, data, send } = require("../..");
const { split, realtype, time, formatTime, formatDate, BigMath, nullish, filterValue, random, String, Math } = require("../../common");
const { log, listFiles, path } = require("../../commonServer");
const { checkPerms, args, chat } = require("../chat/chat");

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

module.exports.fetch = async (subject, user) => {
    switch (subject) {
        case "today": return [0, data().stream.subject];
        case "uptime": return [0, [data().stream.start, data().stream.phase]];
        case "stats": return [0, filterValue(data().global, x => nullish(x) !== null)];
        case "palette": return [0, await send("gizmo", "previouscolor")];
        case "accessory": return [0, await send("gizmo", "previousaccessories")];
        case "user": return [0, {user: {}, shimeji: src().stats.calculate(user)}];
    }
    return [1, ""];
}

const getCommands = (from, chatter, message, text, emote, reply) => "available commands: `"
 + [...Object.values(src())
    .filter(x => 
        ["array", "string"].includes(realtype(x.predicate))
        && x.predicate.length > 0
        && checkPerms(x.permission, from, chatter, message, text, emote, reply))
    .map(x => typeof x.predicate === "string" ? x.predicate : x.predicate[0])
    .flat(), ...Object.keys(INFO_MESSAGES).filter(x => !["v", "help", "commands", "insts", "inst", "instruments", "fonts", "inventory", "inv", "wallet", "clonkspotting"].includes(x)).map(x => "!" + x)].sort().join("`, `")
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
const getInfo = (from, chatter, message, text, emote, reply) => {
    let _args = args(text);
    let target = chatter;
    if (nullish(_args[0]) !== null) {
        _args[0] = _args[0].trim().toLowerCase();
        target = Object.values(data().user).find(x => x.twitch?.login.toLowerCase() === _args[0] || x.twitch?.name.toLowerCase() === _args[0] || x.twitch?.id === _args[0] || x.discord?.id === _args[0] || x.discord?.name.toLowerCase() === _args[0]);
        if (nullish(target) === null) return "Could not find chatter";
    }
    return `iu: ${Math.prec(target.economy.iu)}`;
} 

const INFO_MESSAGES = {
    discord: () => "https://prod.kr/discord",
    screen: () => "https://prod.kr/screen",
    v: () => "https://prod.kr/v",
    docs: () => "https://prod.kr/v",
    document: () => "https://prod.kr/v",
    doc: () => "https://prod.kr/v",
    documents: () => "https://prod.kr/v",
    lore: () => "https://prod.kr/v/lore",
    help: () => "https://prod.kr/v/lore",
    irc: () => "https://prod.kr/discord is also connected to IRC @ colonq.computer:26697 (over TLS) courtesy of the male @LCOLONQ - `/join #prodarea` after connecting",
    vod: () => "https://prod.kr/vod",
    brain: () => "https://prod.kr/v/brain",
    triptech: () => "were putting our entire community on https://onedayonepuzl.web.app/puzzle?week=54&id=William_Williams atm",
    commands: getCommands,
    command: getCommands,
    insts: getInsts,
    instruments: getInsts,
    inst: getInsts,
    instrument: getInsts,
    font: getFonts,
    fonts: getFonts,
    today: async () => data().stream.phase !== -1 ? `Today we're making [${(await module.exports.fetch("today"))[1]}]!` : "Stream is currently offline. Check out more prod at https://prod.kr/discord !",
    uptime: async () => {
        const o = (await module.exports.fetch("uptime"))[1];
        const HOUR = BigInt(1000*60*60); const WEEK = HOUR * 24n * 7n;
        const timezone = BigInt(-new Date("1970-01-01 0:0:0").getTime());
        const nextStream = BigMath.demod(time() - (29n * HOUR), WEEK) + (29n * HOUR) + WEEK - timezone;
        return o[1] !== -1 ? 
            `It's been ${formatTime(BigInt(o[0]), "hhh:mm:ss")} since the broadcast, and its currently phase ${o[1]}!` :
            `Broadcast is currently offline. we go live every ${formatDate(nextStream + timezone, "WWWW H:mm HHH")} (${formatTime(nextStream, time(), "hhh:mm")} away!)`;
    },
    globalstats: async () => {
        let ret = (await module.exports.fetch("stats"))[1];
        ret["windowcount"] = await send("gizmo", "fetch", "windowcount") ?? 0;
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
        let gcp = await module.exports.getGCP();
        return `${getEmote(gcp[1])} The network variance is ${getText(gcp[1])}. (${Math.prec(gcp[1])}%, gcp2: ${getEmote(gcp[2])} ${Math.prec(gcp[2])}%, gcp3: ${getEmote(gcp[3])} ${Math.prec(gcp[3])}%, coherence: ${getEmote(gcp[0])} ${Math.prec(gcp[0])}%)`
    },
    inv: getInfo,
    inventory: getInfo,
    me: getInfo,
    invest: () => data().user[1028054302].special.value > 0 ? "!buyjesus, !buyjudas, !selljesus and !selljudas to trade, !wallet to see inventory, !bankruptsy to declare bankruptsy" : "!buy and !sell to trade, !wallet to see inventory, !bankruptsy to declare bankruptsy",
    songs: async () => "Current Songs: " + (await listFiles("src/@main/data/song")).filter(x => !x.startsWith("_")).map(x => x.slice(0, -".wmid".length)).join(", "),
    clonkspot: () => "https://pub.colonq.computer/~prod/toy/geiserxpi/",
    clonkspotting: () => "https://pub.colonq.computer/~prod/toy/geiserxpi/",
    throne: () => "https://tinyurl.com/prodthrone",
    charity: () => "We are currently fundraising for ACLU as a part of VTubers Against ICE !! \nAccess cheat engine with `!scan` and `!value` \nsupport the cause @ https://prod.kr/charity (every dollar = 100 random byte corruption)"
}
module.exports.predicate = Object.keys(INFO_MESSAGES).map(x => "!" + x);
module.exports.permission = true;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let ret = INFO_MESSAGES[split(text, /\s+/, 1)[0].slice(1).toLowerCase().trim()](from, chatter, message, text, emote, reply);
    if (ret instanceof Promise) ret = await ret;
    _reply(ret);
    return [0, ret];
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
let lastGCP3 = {};
module.exports.getGCP = async () => {
    function coherence(...args) {
        if (args.length < 1) return 100;
        let ret = 0;
        for (let i = 0; i < args.length; i++) for (let j = i + 1; j < args.length; j++)
            ret += 100 - Math.abs(args[i] - args[j]);
        return ret / (args.length * (args.length - 1));
    }
    let global = data().global;
    const GCP3_GETS = {
        "prod": async () => (await module.exports.updateGCP())[1] * 100,
        "Venorrak": async () => Math.clamp((await (await fetch("https://server.venorrak.dev/api/joels/JCP/short?limit=1")).json())[0].JCP, 0, 100),
        "krzysckh": async () => Math.clamp(((await (await fetch("https://api.blg.krzysckh.org/?q=last-gradus")).json()).v + 4) * 100 / 26, 0, 100),
        "nichePenguin": async () => Math.clamp((await (await fetch("https://pub.colonq.computer/~nichepenguin/cgi-bin/np-gfp")).json()).gfp, 0, 1) * 100,
    };
    for (let k in GCP3_GETS) {
        if (lastGCP3[k] === undefined || random() < 0.5) {
            let res = GCP3_GETS[k]();
            if (res instanceof Promise) res = await res;
            lastGCP3[k] = res;
        }
    }
    log("GCP3 DATA:", lastGCP3);
    let gcp3 = coherence(...Object.values(lastGCP3));
    let c = coherence(global.gcp, global.gcp2, gcp3);
    return [c, global.gcp, global.gcp2, gcp3];
}
module.exports.isScreenOn = (_reply, chatter, message) => { 
    let res = require("../../index").sockets().includes("gizmo"); if (!res) _reply?.("gizmo is not active"); 
    if (data().user[108372992].special.lock) 
        if (!["prodzpod", "lala_amanita"].includes(chatter?.twitch?.login)) { _reply?.("a magical force blocks you from interacting with the !screen..."); return false; }
    return res; 
}