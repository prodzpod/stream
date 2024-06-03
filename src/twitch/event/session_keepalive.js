const { debug } = require("../ws")

module.exports.execute = req => {
    debug("Eventsub keepalive", req);
}