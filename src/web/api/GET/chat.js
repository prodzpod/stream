const { numberish } = require("../../../@main/common");
const { WASD } = require("../../common");
const { log, send } = require("../../ws");

module.exports.execute = async (query, body) => {
    query.count ??= 100; query.count = numberish(query.count);
    let history = await send("gethistory");
    return [200, history.slice(-query.count)];
}