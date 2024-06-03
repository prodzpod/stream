const { send } = require("../../ws");

module.exports.execute = async (query, body) => {
    if (!query.prompt || query.prompt.toString().trim() === "") return [204, {error: "no prompt given"}];
    return [200, await send("clone", query.prompt)];
}