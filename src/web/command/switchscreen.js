const { log } = require("../ws");

module.exports.execute = async (...args) => {
    await require("../api/WS/jesusislit/screen")._send("switchscene", ...args);
    return [0, ""];
}