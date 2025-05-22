const { log } = require("../ws");

module.exports.execute = async (value) => {
    await require("../api/WS/jesusislit/overlay")._send("triggeroverlay", value);
    return [0, ""];
}