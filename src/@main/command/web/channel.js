const { src, send } = require("../..");

module.exports.execute = async (channel) => {
    return [0, await send("twitch", "stream", channel)];
}