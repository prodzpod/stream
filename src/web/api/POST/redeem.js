const { send } = require("../../ws");

module.exports.execute = async (query, body) => {
    let res = await send("redeem", query.code, query.id);
    if (typeof res === "string") return [400, res];
    return [200, {res: "done!"}];
}