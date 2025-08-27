const { send } = require("../../ws");

module.exports.execute = async (query, body) => {
    return [200, {"res": await send("twitchloginfromid", query.id)}];
}