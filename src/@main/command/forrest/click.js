const { send, data, src } = require("../..");
const { random, Math, unentry, nullish, WASD } = require("../../common");
const { log } = require("../../commonServer");

module.exports.execute = async (author, x, y) => {
    if (String(author).startsWith("U")) author = 108372992;
    else author = Number(author);
    let chatter = src().user.identify({ twitch: { id: author } }) ?? await src().user.initialize(author);
    await src().click.execute(m => send("twitch", "send", 108372992, "[🌙] " + m, []), "twitch", chatter, {}, `!click ${Number(x) * 1920} ${Number(y) * 1080}`, [], null);
    return [0, ""];
}