const { send, src, data } = require("../..");
const { random } = require("../../common");
const { log } = require("../../commonServer")

const DISALLOWED_COMMANDS = [
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
    "!guy",
    "!draw"
]

module.exports.execute = async (txt, user, channel, id) => {
    log("foreign chat recieved:", user + ":", txt); txt = String(txt);
    if (!txt.startsWith("!") && channel === 1070508385) send("web", "malphon", "setchat", user, txt);
    if (channel === 1070508385 && user === "brighterbotphon") {
        if (txt === "Tilly loves you!") src().malphon.addTilly();
        if (txt === "Tilly will miss you!") src().malphon.removeTilly();
    }
    else if (txt === "JoelCheck") send("twitch", "send", channel, "[🌙] JoelCheck RECIEVE");
    // new cmd system 
    if (txt.startsWith("!") && DISALLOWED_COMMANDS.every(x => !txt.toLowerCase().trim().startsWith(x))) {
        let chatter = Object.values(data().user).find(x => x?.twitch?.id === id);
        chatter ??= await src().user.initialize(id);
        let message = { twitch: {id: null, channel: channel} };
        await src().chat.command("twitch", chatter, message, txt, []);
    }
    return [0, ""];
}