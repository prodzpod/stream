const { send, src, data } = require("../..");
const { WASD } = require("../../common");
const { log } = require("../../commonServer")

module.exports.execute = async (id, name, viewers) => {
    await src().raid.execute(() => {}, {}, {}, {}, WASD.pack("!!raid", id, viewers), {});
    return [0, ""];
}