const { send, log } = require("../../ws");

module.exports.execute = async (query, body) => {
    if (!query.prompt || query.prompt.toString().trim() === "") return [400, {error: "no prompt given"}];
    return [200, await send("clone", query.prompt)];
}