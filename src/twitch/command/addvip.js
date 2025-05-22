const { fetch } = require("../api");
const { STREAMER_ID } = require("../common");
const { log } = require("../ws");

module.exports.execute = async id => {
    fetch("POST", "channels/vips", { user_id: id, broadcaster_id: STREAMER_ID });
    return [0, ""];
}