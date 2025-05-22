const { send, data, src } = require("../..");
const { random, Math, unentry, nullish, WASD, getIdentifier } = require("../../common");
const { log, fetch } = require("../../commonServer");
const { verify } = require("jsonwebtoken");

let logins = {};
let tokens = {};
module.exports.execute = async (...args) => {
    switch (args[0]) {
        case "login":
            try { 
                verify(args[2], Buffer.from(process.env.TWITCH_EXTENSION_SECRET, 'base64'), { algorithms: ['HS256'] }); 
                let chatter = Object.values(data().user).find(x => x?.twitch?.opaqueId === args[1]);
                if (chatter) {
                    tokens[args[2]] = chatter.twitch.id;
                    send("web", "sendextension", args[2], "loginsuccess");
                }
                else {
                    let key = getIdentifier();
                    logins[key] = args[2];
                    send("web", "sendextension", args[2], "login", key);
                }
            } catch (e) { log("login failed:", e); }
            break;
        case "chat":
            let id = tokens[args[1]];
            if (!id) return [1, ""];
            await src().chat.message("web", {twitch: {id: id}}, {}, args[2], [], null);
            break;
    }
    return [0, ""];
}

function announce(v) { send("twitch", "send", null, "[🌙] " + v, []); }

module.exports.tryLogin = async (key, id) => {
    if (!logins[key]) return false;
    let token = logins[key];
    tokens[token] = id;
    send("web", "sendextension", token, "loginsuccess");
    return true;
}