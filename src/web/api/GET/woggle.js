const { log, send } = require("../../ws");

module.exports.execute = async (query, body) => {
    return [200, await send("woggle", Object.keys(query)[0])];
}