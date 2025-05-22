const { log } = require("../ws");

module.exports.execute = async (value) => {
    await require("../api/WS/jesusislit/screen")._send("priceupdate", value);
    return [0, ""];
}