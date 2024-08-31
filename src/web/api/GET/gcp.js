const { send, log } = require("../../ws");

module.exports.execute = async (query, body) => {
    return [200, {res: await send("gcp")}];
}