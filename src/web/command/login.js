const { _login } = require("../api/WS/screen");
const { log } = require("../ws");

module.exports.execute = async (k, chatter, hash) => {
    await _login(k, chatter, hash);
    return [0, ""];
}