const { log, send } = require("../../ws");

module.exports.execute = async (query, body) => {
    return [200, await send("getclonkspot", query.id)];
}