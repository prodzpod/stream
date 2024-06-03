const { send } = require("../..");
const { getIdentifier, safeAssign, split, randomHex } = require("../../common");
const { log, debug } = require("../../commonServer");
const { screenData } = require("../screen/screen");
const { args } = require("./chat");
const { register } = require("./user");
let logins = {};
let ids = [];
module.exports.predicate = "!login";
module.exports.permission = true;
module.exports.execute = async (_reply, from, chatter, message, text, reply) => {
    const _args = args(text);
    if (from !== "twitch" && !_args.length) {
        const id = getIdentifier();
        logins[id] = chatter;
        _reply(`Send \`!login ${id}\` on the Twitch Chat to connect your account.`);
        return [0, ""];
    } else if (_args.length && chatter.twitch) {
        const k = split(text, " ", 1)[1].trim().toLowerCase();
        if (logins[k]) {
            chatter = safeAssign(chatter, logins[k]);
            register(chatter);
            delete logins[k];
            _reply(`Registered to ${chatter.twitch.name}!`);
            return [0, ""];
        } else if (ids.includes(k)) {
            chatter.web ??= {};
            chatter.web.id = randomHex(16);
            register(chatter);
            await send("web", "login", k, screenData(chatter), chatter.web.id);
            _reply("Registered to Screen!");
        } else {
            _reply("Invalid Login");
            return [1, ""];
        }
    } else {
        _reply("This account is not logged in.");
        return [1, ""];
    }
}
module.exports.addID = id => { debug("ID added to watchlist:", id); ids.push(id); }