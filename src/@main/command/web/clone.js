const { send, data, src } = require("../..");
const { random, Math, unentry, nullish, WASD } = require("../../common");
const { log } = require("../../commonServer");

module.exports.execute = async (prompt) => {
    if (!nullish((await send("twitch", "raw", "GET", "streams?user_id=866686220"))?.data?.[0])) return [0, {error: "clonk is not on"}];
    return [0, await src().clone.prompt(prompt)];
}