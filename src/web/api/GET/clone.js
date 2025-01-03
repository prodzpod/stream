const { send, log } = require("../../ws");

module.exports.execute = async (query, body) => {
    if (!query.prompt || query.prompt.toString().trim() === "") return [400, {error: "no prompt given"}];
    let ret = await send("clone", query.prompt);
    if (ret.res !== undefined && typeof ret.res !== "string") ret.res = ret.res.toString();
    return [200, ret];
}