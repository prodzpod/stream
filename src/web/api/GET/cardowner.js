const { numberish } = require("../../../@main/common");
const { WASD } = require("../../common");
const { log, send } = require("../../ws");

module.exports.execute = async (query, body) => {
    return [200, await send("cardowner", query.number)];
}