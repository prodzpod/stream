const { src, send, data } = require("../..");
const { fileExists, log } = require("../../commonServer");

module.exports.execute = async (code, id) => {
    code = String(code).toUpperCase();
    if (!process.env.OFFCARDS4_CODES.split(",").indexOf(code) === -1) return [0, "Invalid Code"];
    if (Object.values(data().user).find(x => x.special?.offcards4 === code)) return [0, "Code is Already Used"];
    let twitch = await send("twitch", "user", id);
    if (!twitch) return [0, "Invalid Twitch Account"];
    let target = data().user[twitch.id] ?? (await src().user.initialize(id));
    if (target.special?.offcards4) return [0, "You've already redeemed another card"];
    data("user." + twitch.id + ".special", { offcards4: code });
    src().pointer.grantAll(twitch.id, "+offcards4");
    return [0, true];
}