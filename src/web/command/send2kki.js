const { _send } = require("../api/WS/2kki");
const { log } = require("../ws");

module.exports.execute = async (arg) => {
    await _send(arg);
    return [0, ""];
}