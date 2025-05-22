const { STREAMER_ID, LALA_ID, FORREST_ID, ELLG_ID } = require("../common");
const { send } = require("../ws")

const clonkCommands = ["!help", "!today", "!discord", "!lore"];

module.exports.execute = req => {
    if (req.chatter_user_id == STREAMER_ID && req.message.text.startsWith("!") && clonkCommands.every(x => !x.includes(req.message.text))) send("chat", {
        chatter: { id: req.chatter_user_id, name: req.chatter_user_name, color: req.color ?? "#000000" },
        message: { id: req.message_id, text: req.message.text, channel: ELLG_ID, emotes: [] },
    });
    else send("clonkchat", req.message.text, req.chatter_user_name, ELLG_ID, req.chatter_user_id, req.message_id);
}