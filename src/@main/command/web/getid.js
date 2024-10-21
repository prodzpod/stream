const { src, data, send } = require("../..");
const { nullish, time, numberish } = require("../../common");
module.exports.execute = async (source) => {
    return [0, await send("twitch", "user", source)];
}