const { send, src, data } = require("../..");
const { time, realtype, trueish, array, unentry, split, WASD, String, occurance, safeAssign, random, BigMath, stringify, numberish, Math, inPlaceSort } = require("../../common")
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

function onInteraction(from, chatter, message, text, emote, reply) {
    // every interaction
    return chatter;
}

module.exports.command = async (from, chatter, message, text, emote, reply) => {
    const processes = Object.keys(src()).filter(x => {
        const predicate = array(trueish(src()[x].predicate));
        const cmd = text?.toString().split(/\s+/)[0].trim().toLowerCase();
        switch (realtype(predicate)) {
            case "boolean": return predicate;
            case "string": return predicate === cmd;
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
            if (!module.exports.checkPerms(src()[x].permission, from, chatter, message, text, emote, reply)){
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
    if (chatter.meta.permission.streamer) return true;
    const permission = array(trueish(source));
    let ret = false;
    switch (realtype(permission)) {
        case "boolean": ret = permission; break;
        case "number": ret = trueish(({
            "0": c => c.twitch?.id,
            "1": c => c.meta.permission.trusted,
            "2": c => c.meta.permission.vip,
            "3": c => c.meta.permission.moderator,
        })[permission](chatter)); break;
        case "function": ret = trueish(permission(from, chatter, message, text, emote, reply)); break;
    }
    return ret;
}

module.exports.args = text => WASD.unpack(split(text, " ", 1)[1]);
function onCommand(from, chatter, message, text, emote, reply) {
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
    for (let source in emotes) for (let k in emotes[source]) {
        let idx = source === "7tv" ? (new RegExp(k + "\\b").exec(text)?.index ?? -1) : text.indexOf(k);
        let temp = "";
        while (idx !== -1) {
            temp += text.slice(0, idx);
            emote = emote.map(x => {
                if (x.position <= temp.length) return x;
                if (x.position <= temp.length + k.length) x.position = temp.length;
                else x.position -= k.length;
                return x;
            })
            emote.push({
                position: temp.length,
                name: k,
                url: emotes[source][k],
                source: source,
                format: emotes[source][k].endsWith(".gif") ? "gif" : "png"
            });
            text = text.slice(idx + k.length);
            idx = source === "7tv" ? (new RegExp(k + "\\b").exec(text)?.index ?? -1) : text.indexOf(k);
        }
        text = temp + text;
    } 
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
        if (chatter.economy.icon.alt) icon += "_ALT";
        icons.push(icon);
        if (chatter.economy.icon.modifier) icons.push("modifier/" + chatter.economy.icon.modifier);
    } else icons.push("common/" + random(data().icon.common));
    send("gizmo", "chat", message.twitch.id, icons.map(x => "icon/" + x), (chatter.twitch?.color ?? "#000000"), name, WASD.toString(handleMeta(source, "gizmo", text, emote)[0]), chatter.twitch && BigMath.between(chatter.meta.last_chatted, data().stream.start, time()) ? 1 : 0);
    src().message.register(message, chatter);
    chatter = onChat(from, chatter, message, stringify(text), emote, reply);
    return [chatter, null];
}
function handleMeta(source, dest, text, emote) {
    text = text.replaceAll("<emote=", "<emοte="); // abuse prevention (bad)
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
            if (x.position <= temp.length) return x;
            if (x.position <= temp.length + i[0].length) x.position = temp.length;
            else x.position -= i[0].length;
            return x;
        });
        temp += ret;
        text = text.slice(i.index + i[0].length);
        i = /<@([^:]+):(\d+)>/.exec(text);
    }
    text = temp + text;
    const textifyAll = e => e.source === "discord" ? `:${e.name}:` : e.name;
    const fn = {
        twitch: textifyAll,
        web: textifyAll,
        gizmo: e => `<emote=${e.url}>`
    };
    if (fn[dest]) {
        for (let e of inPlaceSort(emote, (a, b) => a.position - b.position).reverse())
            text = text.slice(0, e.position).padEnd(e.position, " ") + fn[dest](e) + text.slice(e.position);
        return [text, []];
    }
    return [text, emote];
}
function onChat(from, chatter, message, text, emote, reply) {
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