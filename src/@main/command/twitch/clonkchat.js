const { send, src, data } = require("../..");
const { random, WASD } = require("../../common");
const { log } = require("../../commonServer")

const DISALLOWED_COMMANDS = {
    global: [
        "!discord",
        "!v",
        "!lore",
        "!help",
        "!irc",
        "!vod",
        "!commands", "!command",
        "!today",
        "!uptime",
        "!globalstats",
        "!inv",
        "!inventory",
        "!me",
        "!wallet",
        "!play",
        "!brb",
        "!7tv",
        "!api",
        "!end",
        "!start",
        "!draw",
        "!buy",
        "!sell",
        "!buyjesus",
        "!buyjudas",
        "!selljesus",
        "!selljudas",
        "!draw"
    ],
    "866686220": ["!music", "!game", "!bells", "!guy"],
    "1070508385": ["!guy"],
    "895949231": ["!guy", "!littleguy", "!spawn", "!spawnshimeji", "!gal", "!creature", "!creacher", "!creachre", "!chrechre", "!littlegal", "!unguy", "!despawn", "!putbackinmypokeball", "!ungal", "!despawnshimeji", "!forfeit", "!giveup", "!declareitissoover", "!surrender", "!dishonorabledischarge", "!fight", "!zfight", "!combat", "!strife", "!violence", "!war", "!conflict", "!engageinadiscoursewith", "!attack", "!fisticuffs", "!cease", "!ceasefire", "!peace", "!nonaggressionpact", "!johnlennon", "!autorespawn", "!levelup", "!lvup", "!lvlup", "!level", "!lvl", "!lv"],
    "108372992": ["!guy"],
    "109830946": ["!guy", "!color"],
    "1003351110": [],
    "951678700": [],
    "4484765": [],
    "439183333": ["!guy", "!stats", "!stat"],
}

module.exports.execute = async (txt, user, channel, id, msgId, raw) => {
    log("foreign chat recieved:", user + ":", txt); txt = String(txt);
    if (!txt.startsWith("!") && channel === 1070508385) send("web", "malphon", "setchat", user, txt);
    if (channel === 1070508385 && user === "brighterbotphon") {
        if (txt === "Tilly loves you!") src().malphon.addTilly();
        if (txt === "Tilly will miss you!") src().malphon.removeTilly();
    }
    else if (txt === "JoelCheck") send("twitch", "send", channel, "[🌙] JoelCheck RECIEVE");
    // new cmd system 
    // log(channel, [...DISALLOWED_COMMANDS.global, ...DISALLOWED_COMMANDS[channel]]);
    if (txt.startsWith("!") && [...DISALLOWED_COMMANDS.global, ...DISALLOWED_COMMANDS[channel]].every(x => !txt.toLowerCase().trim().startsWith(x))) {
        let chatter = Object.values(data().user).find(x => x?.twitch?.id === id);
        chatter ??= await src().user.initialize(id);
        let message = { twitch: {id: null, channel: channel} };
        await src().chat.command("twitch", chatter, message, txt, []);
    }
    // lala
    if (channel === 895949231 && data().user[895949231].special?.swap) {
        let chatter = Object.values(data().user).find(x => x?.twitch?.id === id);
        let meta = await src().chat.emotes("twitch", chatter, {}, raw.text ?? "", raw.emotes);
        let txt = await src().chat.emotesToGizmo("twitch", meta[1], meta[2]);
        let icons = [];
        if (chatter.economy?.icon) {
            let icon = chatter.economy.icon.icon;
            if (chatter.economy.icon.alt && require("fs").existsSync(path("src/@main/data/icon/" + icon + "_ALT.png"))) icon += "_ALT";
            icons.push(icon);
            if (chatter.economy.icon.modifier) icons.push("modifier/" + chatter.economy.icon.modifier);
        } else icons.push("common/" + random(data().icon.common));
        send("gizmo", "chat", msgId, icons.map(x => "icon/" + x), (chatter.twitch?.color ?? "#000000"), chatter.twitch?.name ?? Object.values(chatter).find(x => x.name).name, txt, 0);
    }
    return [0, ""];
}