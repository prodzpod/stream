const { CLONK_ID, STREAMER_ID } = require("../common");
const { send } = require("../ws")

module.exports.execute = req => {
    if (req.chatter_user_id == CLONK_ID) { send("clonkchat", req.message.text); }
    else if (req.chatter_user_id == STREAMER_ID && req.message.text.startsWith("!")) send("chat", {
        chatter: { id: req.chatter_user_id, name: req.chatter_user_name, color: req.color ?? "#000000" },
        message: { id: req.message_id, text: req.message.text, channel: CLONK_ID },
    });
}