const { send, src } = require("../..");
const { random } = require("../../common");
const { log } = require("../../commonServer")

module.exports.execute = (txt, user, id) => {
    log("clonkchat recieved:", user + ":", txt);
    if (txt === "JoelCheck") send("twitch", "send", "866686220", "[🌙] JoelCheck RECIEVE");
    else if (txt === "!tranquility") src().tranquility.execute(txt => send("twitch", "send", "866686220", "[🌙] " + txt));
    else if (txt === "!boosts") src().boosts.execute(txt => send("twitch", "send", "866686220", "[🌙] " + txt), "web?", {twitch: {id: id}}, {}, txt);
    else if (txt.startsWith("!clonkspotleaderboard")) src().clonkspotleaderboard.execute(txt => send("twitch", "send", "866686220", "[🌙] " + txt), "web?", {}, {}, txt);
    return [0, ""];
}