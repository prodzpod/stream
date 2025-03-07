const { numberish } = require("../../../@main/common");
const { WASD } = require("../../common");
const { log, send } = require("../../ws");

module.exports.execute = async (query, body) => {
    let res = await send("getuser", query);
    if (!Array.isArray(res)) return [400, res];
    return [200, res];
}