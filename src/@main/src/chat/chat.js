const { send, src, data } = require("../..");
const { time, realtype, trueish, array, unentry, split, WASD, String, occurance, safeAssign, random, BigMath } = require("../../common")
const { debug, verbose, download, log, path } = require("../../commonServer");

module.exports.message = async (from, chatter, message, text, reply) => {
    debug("message", from, chatter, message, text, reply);
    // identify chatter
    let _chatter = src().user.identify(chatter);
    if (_chatter?.twitch) for (const k of Object.keys(_chatter)) {
        if (chatter[k]) _chatter[k] = safeAssign(_chatter[k], chatter[k]);
    } else _chatter = safeAssign(_chatter, chatter);
    if (_chatter.twitch && (time() - BigInt(_chatter.twitch.last_updated ?? 0)) > TWITCH_UPDATE_PERIOD) chatter = await twitchUpdate(_chatter);
    else chatter = _chatter;
    chatter = onInteraction(from, chatter, message, text, reply);
    // identify reply
    if (reply) reply = src().message.identify(reply) ?? reply.fallback;
    [message, text] = await module.exports.emotes(from, chatter, message, text, reply); 
    let ret;
    [chatter, ret] = await module.exports.command(from, chatter, message, text, reply);
    if (!ret) [chatter, ret] = await module.exports.reaction(from, chatter, message, text, reply);
    if (!ret) [chatter, ret] = await module.exports.chat(from, chatter, message, text, reply);
    await src().user.register(chatter);
    debug("chat result:", chatter, ret);
    return ret ?? [0, ""];
}

const TWITCH_UPDATE_PERIOD = BigInt(1000*60*60*24);
const TWITCH_INFO_MAP = {
    "login": "login",
    "display_name": "name",
    "description": "description",
    "profile_image_url": "profile_image",
    "offline_image_url": "offline_image",
    "created_at": "created_at"
}
async function twitchUpdate(chatter) {
    let _twitch = await send("twitch", "user", chatter.twitch?.id);
    if (!_twitch?.id) return chatter;
    for (let k of Object.keys(TWITCH_INFO_MAP)) if (_twitch[k]) chatter.twitch[TWITCH_INFO_MAP[k]] = _twitch[k];
    if (chatter.twitch.profile_image) chatter.twitch.profile = await download(chatter.twitch.profile_image, "user", chatter.twitch.id + ".twitch.png");
    chatter.twitch.last_updated = time();
    if (chatter.discord?.profile_image) chatter.discord.profile = await download(chatter.discord.profile_image + "?size=300", "user", chatter.twitch.id + ".discord.png");
    return chatter;
}
function onInteraction(from, chatter, message, text, reply) {
    chatter.meta ??= {};
    chatter.economy ??= {};
    chatter.economy.iu ??= 0;
    chatter.economy.icon ??= { icon: "", alt: false, modifier: null };
    chatter.economy.icons ??= {};
    if (!Object.keys(chatter.economy.icons).length) {
        const icon = random(data().icon.common);
        chatter.economy.icon.icon = "common/" + icon;
        chatter.economy.icons[icon] = { alt: false, modifiers: [] };
    }
    chatter.economy.pointer ??= {};
    chatter.economy.pointers ??= {};
    if (!Object.keys(chatter.economy.pointers).length) {
        const pointers = data().pointer.cursor.sprite;
        chatter.economy.pointers.cursor = pointers;
        for (const k of pointers) chatter.economy.pointer[k] = "cursor";
    }
    chatter.shimeji ??= {};
    chatter.shimeji.sprite ??= null;
    chatter.shimeji.ai ??= {};
    chatter.shimeji.stats ??= {};
    chatter.shimeji.history ??= {};
    chatter.meta.last_chatted ??= 0;
    chatter.meta.last_interacted = time();
    chatter.meta.permission = {
        streamer: chatter.twitch?.badges?.includes("broadcaster-1") ?? false
    }
    return chatter;
}

module.exports.command = async (from, chatter, message, text, reply) => {
    const processes = Object.keys(src()).filter(x => {
        const predicate = array(trueish(src()[x].predicate));
        const cmd = text?.toString().split(/\s+/)[0].trim().toLowerCase();
        switch (realtype(predicate)) {
            case "boolean": return predicate;
            case "string": return predicate === cmd;
            case "array": return predicate.includes(cmd);
            case "function": return trueish(x.predicate(from, chatter, message, text, reply));
        }
        return false;
    });
    if (processes.length) { // process!
        chatter = onCommand(from, chatter, message, text, reply);
        const mainProcess = processes.find(x => ["string", "array"].includes(realtype(array(trueish(src()[x].predicate))))) ?? processes[0];
        const res = unentry(await Promise.all(processes.map(async x => {
            debug("[message]", "processing command", x);
            const _reply = getReply(from, chatter, message, text, reply);
            if (!module.exports.checkPerms(src()[x].permission, from, chatter, message, text, reply)){
                _reply("Insufficient Permission");
                return [x, [1, "insufficient permission"]];
            }
            let ret = src()[x].execute(_reply, from, chatter, message, text, reply);
            if (ret instanceof Promise) ret = await ret;
            return [x, ret];
        })));
        return [chatter, res[mainProcess]];
    } else return [chatter, null];
} 

module.exports.checkPerms = (source, from, chatter, message, text, reply) => {
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
        case "function": ret = trueish(permission(from, chatter, message, text, reply)); break;
    }
    return ret;
}

module.exports.args = text => WASD.unpack(split(text, " ", 1)[1]);
function onCommand(from, chatter, message, text, reply) {
    return chatter;
}
function getReply(from, chatter, message, text, reply) { switch (from) {
    case "twitch": return content => send("twitch", "send", message.twitch.channel, "[🌙] " + content, message.twitch.id);
    case "discord": return content => send("discord", "send", message.discord.channel, content, message.discord.id);
    case "web": return content => send("web", "info", chatter.twitch.id, content);
}}

module.exports.emotes = async (from, chatter, message, text, reply) => {
    // TODO: replace <emote> with blanks, create message.emote with index, sitewide forms and url
    return [message, text];
}
module.exports.reaction = async (from, chatter, message, text, reply) => {
    // TODO: check for text: just emoji
    return [chatter, null];
}

module.exports.chat = async (from, chatter, message, text, reply) => {
    if ((message.twitch && message.twitch.channel != "140410053") ||
        (message.discord && message.discord.channel != "1219954701726912586")) return [chatter, null];
    const name = chatter.twitch?.name ?? Object.values(chatter).find(x => x.name).name;
    // TODO: replace emotes
    if (!message.twitch) message.twitch = (await send("twitch", "send", null, `@${name}: ${text}`, reply?.twitch?.id));
    if (!message.discord) message.discord = (await send("discord", "send", null, `\`<@${name}>\`: ${text}`, reply?.discord?.id));
    send("gizmo", "chat", "icon/" + chatter.economy.icon.icon, (chatter.twitch?.color ?? "#000000"), name, text, chatter.twitch && BigMath.between(chatter.meta.last_chatted, data().stream.start, time()) ? 1 : 0);
    src().message.register(message);
    chatter = onChat(from, chatter, message, text, reply);
    return [chatter, null];
}
function onChat(from, chatter, message, text, reply) {
    const iu = text.length / 10;
    chatter.economy.iu = Number(chatter.economy.iu) + iu;
    send("web", "iu", chatter.twitch.id, chatter.economy.iu);
    const global = data().global; let found = false;
    for (const k in GLOBAL_OCCURANCE) {
        const occ = occurance(text.toLowerCase(), GLOBAL_OCCURANCE[k]);
        if (occ > 0) { found = true; global[k] ??= 0; global[k] += occ; }
    }
    if (found) data("global", global);
    chatter.meta.last_chatted = time();
    return chatter;
}
const GLOBAL_OCCURANCE = {
    joel: "joel",
    plus2: "+2",
    minus2: "-2",
    ICANT: "icant",
};