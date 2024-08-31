const { fetch } = require("../api");
const { STREAMER_ID } = require("../common");
const { log } = require("../ws");

module.exports.execute = async id => {
    return [0, await fetch("DELETE", `moderation/chat?broadcaster_id=${STREAMER_ID}&moderator_id=${STREAMER_ID}&message_id=${id}`)];
}