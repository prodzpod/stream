const { _send } = require("../api/WS/jake2");
const { log } = require("../ws");

module.exports.execute = async (arg) => {
    await _send(arg);
    return [0, ""];
}