const { send } = require("../../ws");

module.exports.execute = async (query, body) => {
    return [200, await send("bullet", query.input ?? ""), ".xml"];
}