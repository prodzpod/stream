const { numberish } = require("../../../@main/common");
const { WASD } = require("../../common");
const { log, send } = require("../../ws");
const bcrypt = require("bcrypt");

module.exports.execute = async (query, body) => {
    let res = await send("genkey", query.login);
    let pw = await bcrypt.hash(query.login + process.env.STREAM_WEB_SALT, 10);
    if (res) return [200, `{"res": "your key is\n&id=${query.login}&pw=${pw}\ninclude it at the end of your chat calls to access account specific things", "pw": "${pw}"}`];
    else return [400, `{"res":"cannot find logins"}`];
    return [200, ""]
}