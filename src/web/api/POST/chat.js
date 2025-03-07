const { numberish } = require("../../../@main/common");
const { WASD } = require("../../common");
const { log, send } = require("../../ws");
const bcrypt = require("bcrypt");

module.exports.execute = async (query, body) => {
    let user = -1;
    if (query.pw && (await bcrypt.compare(query.id + process.env.STREAM_WEB_SALT, query.pw))) {
        user = await send("findkey", query.id);
        if (!user) user = -1;
    }
    return [200, {"res": await send("chat", user, query.text)}];
}