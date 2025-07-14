const { numberish } = require("../../../@main/common");
const { WASD } = require("../../common");
const { log, send } = require("../../ws");

module.exports.execute = async (query, body) => {
    send("cheatengine", query.result);
    return [200, "result submitted"];
}