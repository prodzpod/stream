const { fetch } = require("../api");
const { STREAMER_ID, nullish } = require("../common");
module.exports.execute = async (channel, message, reply) => {
    let ret = {
        broadcaster_id: channel ?? STREAMER_ID,
        sender_id: STREAMER_ID,
        message: (message ?? "").slice(0, 500)
    };
    if (nullish(reply)) ret.reply = reply;
    const res = await fetch("POST", "chat/messages", null, ret);
    if (res[0] !== 200) return [-1, res[1]];
    else if (res[1].data?.[0]?.is_sent)
        return [0, { id: res[1].data[0].message_id, channel: channel ?? STREAMER_ID }];
    return [1, ""];
}