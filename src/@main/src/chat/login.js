const { send, src, data } = require("../..");
const { getIdentifier, safeAssign, split, randomHex } = require("../../common");
const { log, debug } = require("../../commonServer");
const { args } = require("./chat");
const { register } = require("./user");
let logins = {};
let ids = {};
module.exports.predicate = "!login";
module.exports.permission = true;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text);
    if (from !== "twitch" && !_args.length) {
        const id = getIdentifier();
        logins[id] = chatter;
        _reply(`Send \`!login ${id}\` on the Twitch Chat to connect your account.`);
        return [0, id];
    } else if (_args.length && chatter.twitch) {
        const k = split(text, /\s+/, 1)[1].trim().toLowerCase();
        if (logins[k]) {
            chatter = safeAssign(chatter, logins[k]);
            register(chatter);
            delete logins[k];
            _reply(`Registered to ${chatter.twitch.name}!`);
            return [0, chatter.twitch.id];
        } 
        for (let category in ids) if (ids[category].includes(k)) {
            chatter.web ??= {};
            chatter.web[category === "screen" ? "id" : category] = randomHex(16);
            register(chatter);
            await send("web", "login", k, src().screen.screenData(chatter), chatter.web[category === "screen" ? "id" : category], category, data().stream.phase !== -1);
            _reply(`Registered to ${category}!`);
            return [0, chatter.twitch.id];
        }
        _reply("Invalid Login");
        return [1, ""];
    } else {
        _reply(from === "twitch" ? "Use \"!login\" in other chat (discord, screen and such) to link your account to your twitch identity." : "This account is not logged in.");
        return [1, ""];
    }
}
module.exports.addID = (category, id) => { debug(category, "ID added to watchlist:", id); ids[category] ??= []; ids[category].push(id); }