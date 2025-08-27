const { src, send } = require("../..");

module.exports.execute = async (id) => {
    return [0, (await send("twitch", "user", id))?.login];
}