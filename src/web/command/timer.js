const { _send } = require("../api/WS/timer");
const { log } = require("../ws");

module.exports.execute = (...args) => {
    _send(...args);
    return [0, ""];
}