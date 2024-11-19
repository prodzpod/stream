const { send, src, data } = require("../..");
const { time, realtype, trueish, array, unentry, split, WASD, String, occurance, safeAssign, random, BigMath, stringify, numberish, Math, nullish } = require("../../common")
const { debug, verbose, download, log, path, fileExists } = require("../../commonServer");

module.exports.message = async (from, chatter, message, text, emote, reply) => {
    debug("message", from, chatter, message, text, emote, reply);
    // identify chatter
    chatter = src().user.identify(chatter);
    if (chatter.twitch) chatter = await src().user.initialize(chatter.twitch.id, true);
    chatter = onInteraction(from, chatter, message, text, emote, reply);
    // identify reply
    if (reply) reply = src().message.identify(reply) ?? reply.fallback;
    let ret;
    [chatter, ret] = await module.exports.command(from, chatter, message, text, emote, reply);
    [message, text, emote] = await module.exports.emotes(from, chatter, message, text, emote, reply); 
    if (!ret) [chatter, ret] = await module.exports.reaction(from, chatter, message, text, emote, reply);
    if (!ret) [chatter, ret] = await module.exports.chat(from, chatter, message, text, emote, reply);
    await src().user.register(chatter);
    debug("chat result:", chatter, ret);
    return ret ?? [0, ""];
}

const WEEKLY_IU_PERIOD = BigInt(7*1000*60*60*24);
const WEEKLY_IU = 5000;
function onInteraction(from, chatter, message, text, emote, reply) {
    // every interaction
    if (chatter.meta && data().stream.phase > -1) {    
        let _last_interacted = chatter.meta.last_interacted;
        let _time = time();
        if (nullish(_last_interacted) === null || BigMath.between(chatter.economy.weekly, _last_interacted, _time + 1n)) {
            updateThis = true;
            chatter.economy.iu = Number(chatter.economy.iu) + WEEKLY_IU;
            chatter.economy.weekly = BigMath.demod(_time - 313200000n, WEEKLY_IU_PERIOD) + 313200000n + WEEKLY_IU_PERIOD; 
        }
        chatter.meta.last_interacted = _time;
    }
    return chatter;
}

module.exports.command = async (from, chatter, message, text, emote, reply) => {
    const processes = Object.keys(src()).filter(x => {
        const predicate = array(trueish(src()[x].predicate));
        const cmd = text?.toString().split(/\s+/)[0].trim().toLowerCase();
        switch (realtype(predicate)) {
            case "boolean": return predicate;
            case "string": return predicate === cmd;
            let _time = time();
            case "array": return predicate.includes(cmd);
            case "function": return trueish(x.predicate(from, chatter, message, text, emote, reply));
        }
        return false;
    });
    if (processes.length) { // process!
        chatter = onCommand(from, chatter, message, text, emote, reply);
        const mainProcess = processes.find(x => ["string", "array"].includes(realtype(array(trueish(src()[x].predicate))))) ?? processes[0];
        const res = unentry(await Promise.all(processes.map(async x => {
            debug("[message]", "processing command", x);
            const _reply = getReply(from, chatter, message, text, emote, reply);
            if (!module.exports.checkPerms(src()[x]?.permission, from, chatter, message, text, emote, reply)){
                _reply("Insufficient Permission");
                return [x, [1, "insufficient permission"]];
            }
            let ret = src()[x].execute(_reply, from, chatter, message, text, emote, reply);
            if (ret instanceof Promise) ret = await ret;
            return [x, ret];
        })));
        return [chatter, res[mainProcess]];
    } else return [chatter, null];
} 

module.exports.checkPerms = (source, from, chatter, message, text, emote, reply) => {
    if (chatter.meta?.permission.streamer) return true;
    const permission = array(trueish(source));
    let ret = false;
    switch (realtype(permission)) {
        case "boolean": ret = permission; break;
        case "number": ret = trueish(({
            "0": c => c.twitch?.id,
            "1": c => c.meta?.permission.trusted ?? false,
            "2": c => c.meta?.permission.vip ?? false,
            "3": c => c.meta?.permission.moderator ?? false,
        })[permission](chatter)); break;
        case "function": ret = trueish(permission(from, chatter, message, text, emote, reply)); break;
    }
    return ret;
}

module.exports.args = text => WASD.unpack(split(text, " ", 1)[1]);
function onCommand(from, chatter, message, text, emote, reply) {
    if (chatter?.shimeji?.ai) {
        chatter.shimeji.ai.luck.max += 1;
        chatter.shimeji.ai.luck.value += 1;
    }
    return chatter;
}
function getReply(from, chatter, message, text, emote, reply) { switch (from) {
    case "twitch": return content => send("twitch", "send", message.twitch.channel, "[🌙] " + content, [], message.twitch.id);
    case "discord": return content => send("discord", "send", message.discord.channel, WASD.toString(content), [], message.discord.id);
    case "web": return content => send("web", "info", chatter.twitch?.id, WASD.toString(content));
}}
module.exports.emotesToGizmo = async (source, text, emote, offset=0) => {
    let _;
    emote = emote.map(x => { x.position -= offset; return x; }).filter(x => Math.between(0, x.position, text.length));
    [_, text, emote] = await module.exports.emotes(null, {}, {}, text, emote, null);
    return WASD.toString(handleMeta(source, "gizmo", text, emote)[0]);
}
module.exports.emotes = async (from, chatter, message, text, emote, reply) => {
    let emotes = data().emote;
    // Detect Emotes
    let spaces = [];
    for (let source in emotes) for (let name in emotes[source]) {
        let re = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        re = new RegExp(source === "7tv" ? `\\b${re}\\b` : re, "g");
        let matches = Array.from(text.matchAll(re)).map(x => x.index);
        for (let idx of matches) {
            let bound = [idx, idx + name.length];
            if (source === "vanilla") {
                if (text[bound[1]] === "\uFE0E") { spaces.push([bound[1], bound[1] + 1]); continue; }
                if (text[bound[1]] === "\uFE0F") bound[1]++;
            }
            if (spaces.some(x => Math.between(x[0], x[1] - 1, bound[0], bound[1] - 1))) continue;
            spaces.push(bound);
            emote.push({
                position: idx,
                name: name,
                url: emotes[source][name],
                source: source,
                format: emotes[source][name].endsWith(".gif") ? "gif" : "png"
            });
        }
    } 
    emote = emote.sort((a, b) => a.position - b.position);
    for (let space of spaces.sort((a, b) => a[0] - b[0]).reverse()) {
        text = text.slice(0, space[0]) + text.slice(space[1]);
        emote = emote.map(x => {
            if (x.position <= space[0]) return x;
            if (x.position <= space[1]) x.position = space[0];
            else x.position -= space[1] - space[0];
            return x;
        })
    }
    // Download Emotes
    for (let i = 0; i < emote.length; i++) {
        let p = `emote/${emote[i].source}/${emote[i].name.replace(/\W/g, "_")}.${emote[i].format}`;
        let fullp = emote[i].url.startsWith("src/") ? emote[i].url : (`src/@main/data/` + p);
        if (emote[i].url.startsWith("http") && !fileExists(fullp)) {
            log("Downloading New Emote:", emote[i].url);
            await download(emote[i].url, p);
            if (p.endsWith(".gif")) require("child_process").execSync(`python ${path("src/@main/data/emote/extractFrames.py")} ${path(fullp)}`);
        }
        emote[i].url = path(fullp);
    }
    return [message, text, emote];
}
module.exports.reaction = async (from, chatter, message, text, emote, reply) => {
    // TODO: check for text: just emoji
    return [chatter, null];
}

module.exports.chat = async (from, chatter, message, text, emote, reply) => {
    if ((message.twitch && message.twitch.channel != "140410053") ||
        (message.discord && message.discord.channel != "1219954701726912586")) return [chatter, null];
    const name = chatter.twitch?.name ?? Object.values(chatter).find(x => x.name).name;
    let source = Object.keys(message)[0] ?? "";
    if (!message.twitch) {
        let meta = handleMeta(source, "twitch", text, emote);
        meta[1] = meta[1].map(x => { x.position += `@${name}: `.length; return x; });
        message.twitch = (await send("twitch", "send", null, `@${name}: ${meta[0]}`, meta[1], reply?.twitch?.id));
    }
    if (!message.discord) {
        let meta = handleMeta(source, "discord", text, emote);
        meta[1] = meta[1].map(x => { x.position += `\`<@${name}>\`: `.length; return x; });
        message.discord = (await send("discord", "send", null, `\`<@${name}>\`: ${meta[0]}`, meta[1], reply?.discord?.id));
    }
    let icons = [];
    if (chatter.economy?.icon) {
        let icon = chatter.economy.icon.icon;
        if (chatter.economy.icon.alt && require("fs").existsSync(path("src/@main/data/icon/" + icon + "_ALT.png"))) icon += "_ALT";
        icons.push(icon);
        if (chatter.economy.icon.modifier) icons.push("modifier/" + chatter.economy.icon.modifier);
    } else icons.push("common/" + random(data().icon.common));
    send("gizmo", "chat", message.twitch.id, icons.map(x => "icon/" + x), (chatter.twitch?.color ?? "#000000"), name, WASD.toString(handleMeta(source, "gizmo", text, emote)[0]), chatter.twitch && BigMath.between(chatter.meta.last_chatted, data().stream.start, time()) ? 1 : 0);
    src().message.register(message, chatter);
    chatter = onChat(from, chatter, message, stringify(text), emote, reply);
    return [chatter, null];
}
function handleMeta(source, dest, text, emote) {
    text = text.replace(/<[Ee][Mm][Oo][Tt][Ee]=/g, "<emοte="); // abuse prevention (bad)
    emote = JSON.parse(JSON.stringify(emote));
    let i = /<@([^:]+):(\d+)>/.exec(text);
    let temp = "";
    while (i) {
        temp += text.slice(0, i.index);
        let ret = "@" + i[1];
        let chatter = {}; chatter[source] = {id: i[2]}
        chatter = src().user.identify(chatter);
        if (chatter[dest]) switch (dest) {
            case "twitch": ret = `@${chatter[dest].login}`; break;
            case "discord": ret = `<@${chatter[dest].id}>`; break;
        }
        emote = emote.map(x => {
            if (x.position <= temp.length) return x + ret.length;
            if (x.position <= temp.length + i[0].length) x.position = temp.length + ret.length;
            else x.position += ret.length - i[0].length;
            return x;
        });
        temp += ret;
        text = text.slice(i.index + i[0].length);
        i = /<@([^:]+):(\d+)>/.exec(text);
    }
    text = temp + text;
    const textifyAll = e => e.source === "discord" ? `:${e.name}:` : (e.name + (e.source === "vanilla" ? "\uFE0F" : ""));
    const fn = {
        twitch: textifyAll,
        web: textifyAll,
        gizmo: e => `<emote=${e.url}>`
    };
    if (fn[dest]) {
        for (let e of emote.sort((a, b) => a.position - b.position).reverse())
            text = text.slice(0, e.position).padEnd(e.position, " ") + fn[dest](e) + text.slice(e.position);
        return [text, []];
    }
    return [text, emote];
}

function onChat(from, chatter, message, text, emote, reply) {
    if (chatter?.shimeji?.ai) {
        let alphaOnly = text.replace(/[^A-Za-z]+/g, "").split("");
        chatter.shimeji.ai.wisdom.max += alphaOnly.length;
        chatter.shimeji.ai.wisdom.value += alphaOnly.filter(x => ["a", "e", "i", "o", "u"].includes(x.toLowerCase())).length;
        chatter.shimeji.ai.agility.max += 50;
        chatter.shimeji.ai.agility.value += Math.max(0, 50 - text.length);
        chatter.shimeji.ai.aggression.max += alphaOnly.length;
        chatter.shimeji.ai.aggression.value += alphaOnly.filter(x => x === x.toUpperCase()).length;
        chatter.shimeji.ai.jumpness.max += 1;
        if (".,?!".split("").some(x => text.includes(x))) chatter.shimeji.ai.jumpness.value += 1;
        chatter.shimeji.ai.jokerness.max += 1;
        if ([":3", "x3", "meow", "mew", "miao", "miaow", "mrr", "mrp", "nya", "nyo"].some(x => text.toLowerCase().includes(x))) chatter.shimeji.ai.jokerness.value += 1;
        chatter.shimeji.ai.strength.max += 1;
        if (emote.length) chatter.shimeji.ai.strength.value += 1;
        chatter.shimeji.ai.jumpheight.max += alphaOnly.length - 1;
        chatter.shimeji.ai.jumpheight.value += alphaOnly.filter((x, i, arr) => { if (i === 0) return false; return x === arr[i - 1]; }).length;
        chatter.shimeji.ai.camelness.max += text.length;
        chatter.shimeji.ai.camelness.value += text.length - alphaOnly.length;
        chatter.shimeji.ai.luck.max += 1;
        chatter.shimeji.ai.dexterity.max += 1;
        chatter.shimeji.ai.dexterity.value += 1;
        chatter.shimeji.ai.bisonness.max += 1;
        if (emote.some(x => ["joel", "jol", "leoj", "fish"].some(y => x.name.toLowerCase().toLowerCase().includes(y)))
            || ["joel", "jol", "leoj", "fish"].some(x => text.toLowerCase().includes(x))) chatter.shimeji.ai.bisonness.value += 1;
        let words = text.toLowerCase().replace(/[^a-z\s]+/g, "").split(/\s+/g).filter(x => x.length);
        chatter.shimeji.ai.zebraness.max += words.length;
        let bible = data().bible;
        chatter.shimeji.ai.zebraness.value += words.reduce((p, x) => { 
            let ret = bible[x] ?? 0;
            if (ret > 1000) ret = 1000;
            if (ret > 0) ret = 0.4 + (ret / 1000 * 0.6);
            return p + Math.clamp(ret, 0, 1);
        }, 0);
    }
    const iu = numberish(text.length / 100 + emote.length / 10);
    if (realtype(iu) === "number" && chatter.twitch) {
        chatter.economy.iu = Number(chatter.economy.iu) + iu;
        send("web", "iu", chatter.twitch.id, chatter.economy.iu);
    }
    const global = data().global; let found = false;
    for (const k in GLOBAL_OCCURANCE) {
        const occ = occurance(text.toLowerCase(), GLOBAL_OCCURANCE[k]);
        if (occ > 0) { found = true; global[k] ??= 0; global[k] += occ; }
    }
    if (found) data("global", global);
    if (chatter.meta) chatter.meta.last_chatted = time();
    return chatter;
}
const GLOBAL_OCCURANCE = {
    joel: "joel",
    plus2: "+2",
    minus2: "-2",
    ICANT: "icant",
};

module.exports.delete = async message => {
    message = src().message.identify(message);
    for (let k in message) switch (k) {
        case "discord":
            await send("discord", "delete", message.discord.id, message.discord.channel); break;
        case "twitch":
            await send("twitch", "delete", message.twitch.id); break;
    }
    await send("gizmo", "explode", message.twitch.id);
    src().message.delete(message);
    if (message === null) return;
}